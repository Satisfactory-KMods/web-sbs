import fs from "fs";
import path from "path";


export type TTasksRunner = "SCIM Query";

export class JobTask {
	public jobName = "";
	protected interval = 60000;
	protected task: NodeJS.Timer;
	protected taskFunction: ( CallCount: number ) => Promise<void>;
	protected tickCount = 1;
	protected isRun = false;
	protected runNextTask = [ false, false ];

	constructor(
		interval: number,
		jobName: TTasksRunner,
		task: ( CallCount: number ) => Promise<void>
	) {
		this.jobName = jobName;
		this.interval = interval;
		this.taskFunction = task;
		this.task = setInterval( this.tick.bind( this ), this.interval );
		this.tick().then( () => console.info( "start", `Init run job:`, this.jobName )
		);
	}

	public updateTickTime( NewTime: number ) {
		clearInterval( this.task );
		this.task = setInterval( this.tick.bind( this ), NewTime );
	}

	public destroyTask() {
		clearInterval( this.task );
	}

	public async forceTask( ResetTime = false ) {
		if( this.isRun ) {
			this.runNextTask = [ true, ResetTime ];
		}

		await this.tick();
		if( ResetTime ) {
			this.destroyTask();
			this.task = setInterval( this.tick.bind( this ), this.interval );
		}
	}

	protected async tick() {
		this.isRun = true;
		await this.taskFunction( this.tickCount );
		this.isRun = false;
		this.tickCount++;
		if( this.tickCount >= 1000 ) {
			this.tickCount = 1;
		}

		if( this.runNextTask[ 0 ] ) {
			if( this.runNextTask[ 1 ] ) {
				this.destroyTask();
				this.task = setInterval( this.tick.bind( this ), this.interval );
			}
			this.runNextTask = [ false, false ];
			await this.tick();
		}
	}
}

export class TaskManagerClass {
	public jobs: Record<string, JobTask> = {};

	async init() {
		const jobDir = path.join( process.cwd(), "src/taskServer/taskManager/jobs" );
		console.info( "Load jobs in dir", jobDir, fs.readdirSync( jobDir ).length );
		for( const file of fs.readdirSync( jobDir ) ) {
			console.info( "try to load job", path.join( jobDir, file ) );
			const stats = fs.statSync( path.join( jobDir, file ) );
			if( stats.isFile() && file.endsWith( ".task.ts" ) ) {
				const jobClass: JobTask = ( await import( path.join( jobDir, file ) ) ).default as JobTask;
				this.jobs[ jobClass.jobName ] = jobClass;
				console.info( "Loaded Job:", jobClass.jobName );
			}
		}
	}

	tunTask( task: TTasksRunner, ResetTimer = false ) {
		if( this.jobs[ task ] ) {
			this.jobs[ task ]?.forceTask( ResetTimer );
		}
	}
}

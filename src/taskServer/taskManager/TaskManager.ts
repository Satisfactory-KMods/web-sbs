import fs from "fs";
import path from "path";


export type TTasksRunner = "MakeItCleanDeepCheck" | "MakeItClean" | "SCIM";

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
		this.tick().then( () => SystemLib.Log( "start", `Init run job:`, SystemLib.ToBashColor( "Red" ), this.jobName )
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
		for( const file of fs.readdirSync(
			path.join( __dirname, "/tasks/jobs" )
		) ) {
			const Stats = fs.statSync(
				path.join( __dirname, "/tasks/jobs", file )
			);
			if( Stats.isFile() && file.endsWith( ".task.ts" ) ) {
				const jobClass: JobTask = (
					await import( path.join( __dirname, "/tasks/jobs", file ) )
				).default as JobTask;
				this.jobs[ jobClass.jobName ] = jobClass;
			}
		}
	}

	tunTask( task: TTasksRunner, ResetTimer = false ) {
		if( this.jobs[ task ] ) {
			this.Jobs[ task ].ForceTask( ResetTimer );
		}
	}
}

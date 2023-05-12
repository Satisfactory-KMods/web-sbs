import fs from "fs";
import path from "path";

export type TTasksRunner = "FicsitQuery" | "MakeItClean";

export class JobTask {
	public JobName = "";
	protected Interval = 60000;
	protected Task: NodeJS.Timer;
	protected TaskFunction: ( CallCount: number ) => Promise<void>;
	protected TickCount = 1;
	protected IsRun = false;
	protected RunNextTask = [ false, false ];

	constructor(
		Interval: number,
		JobName: TTasksRunner,
		Task: ( CallCount: number ) => Promise<void>
	) {
		this.JobName = JobName;
		this.Interval = Interval;
		this.TaskFunction = Task;
		this.Task = setInterval( this.Tick.bind( this ), this.Interval );
		this.Tick().then( () =>
			SystemLib.Log( "start", `Init run job:`, SystemLib.ToBashColor( "Red" ), this.JobName )
		);
	}

	public UpdateTickTime( NewTime: number ) {
		clearInterval( this.Task );
		this.Task = setInterval( this.Tick.bind( this ), NewTime );
	}

	public DestroyTask() {
		clearInterval( this.Task );
	}

	public async ForceTask( ResetTime = false ) {
		if( this.IsRun ) {
			this.RunNextTask = [ true, ResetTime ];
		}

		await this.Tick();
		if( ResetTime ) {
			this.DestroyTask();
			this.Task = setInterval( this.Tick.bind( this ), this.Interval );
		}
	}

	protected async Tick() {
		this.IsRun = true;
		await this.TaskFunction( this.TickCount );
		this.IsRun = false;
		this.TickCount++;
		if( this.TickCount >= 1000 ) {
			this.TickCount = 1;
		}

		if( this.RunNextTask[ 0 ] ) {
			if( this.RunNextTask[ 1 ] ) {
				this.DestroyTask();
				this.Task = setInterval( this.Tick.bind( this ), this.Interval );
			}
			this.RunNextTask = [ false, false ];
			await this.Tick();
		}
	}
}

export class TaskManagerClass {
	public Jobs: Record<string, JobTask> = {};

	async Init() {
		for( const File of fs.readdirSync(
			path.join( __BaseDir, "/Tasks/Jobs" )
		) ) {
			const Stats = fs.statSync(
				path.join( __BaseDir, "/Tasks/Jobs", File )
			);
			if( Stats.isFile() && File.endsWith( ".Task.ts" ) ) {
				const JobClass: JobTask = (
					await import( path.join( __BaseDir, "/Tasks/Jobs", File ) )
				).default as JobTask;
				this.Jobs[ JobClass.JobName ] = JobClass;
			}
		}
	}

	RunTask( Task: TTasksRunner, ResetTimer = false ) {
		if( this.Jobs[ Task ] ) {
			this.Jobs[ Task ].ForceTask( ResetTimer );
		}
	}
}

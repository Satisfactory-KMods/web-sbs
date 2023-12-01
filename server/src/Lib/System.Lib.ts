import * as console from 'console';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import process from 'process';
import Util from 'util';

export type BashColorString =
	| 'Default'
	| 'Red'
	| 'Black'
	| 'Green'
	| 'Yellow'
	| 'Blue'
	| 'Magenta'
	| 'Cyan'
	| 'Light Gray'
	| 'Dark Gray'
	| 'Light Red'
	| 'Light Green'
	| 'Light Yellow'
	| 'Light Magenta'
	| 'Light Cyan'
	| 'White';

export class systemLibClass {
	public readonly IsDevMode: boolean;

	static IsDev(): boolean {
		return process.env.NODE_ENV !== 'production';
	}

	constructor() {
		this.IsDevMode = systemLibClass.IsDev();

		this.DebugLog('SYSTEM', 'Try to load:', '.env');
		dotenv.config();
		if (this.IsDevMode) {
			this.DebugLog('SYSTEM', 'Try to load:', '.env.dev');
			dotenv.config({
				path: '.env.dev'
			});
		} else {
			this.DebugLog('SYSTEM', 'Try to load:', '.env.local');
			dotenv.config({
				path: '.env.local'
			});
		}

		const MaxFiles = 10;
		let counter = 0;
		for (const file of fs.readdirSync(path.join(__MountDir, 'Logs')).sort((a, b) => {
			const A = parseInt(a.replace('.log', ''));
			const B = parseInt(b.replace('.log', ''));
			return B - A;
		})) {
			counter++;
			if (MaxFiles <= counter) {
				fs.rmSync(path.join(__MountDir, 'Logs', file), { recursive: true });
				this.LogWarning('SYSTEM', 'Remove old log file:', path.join(__MountDir, 'Logs', file));
			}
		}
	}

	public DebugMode(): boolean {
		return this.IsDevMode;
	}

	static TBC(String: BashColorString) {
		switch (String) {
			case 'Black':
				return '\x1B[30m';
			case 'Cyan':
				return '\x1B[36m';
			case 'Dark Gray':
				return '\x1B[90m';
			case 'Light Cyan':
				return '\x1B[96m';
			case 'Light Gray':
				return '\x1B[37m';
			case 'Light Green':
				return '\x1B[32m';
			case 'Light Magenta':
				return '\x1B[35m';
			case 'Light Red':
				return '\x1B[91m';
			case 'Light Yellow':
				return '\x1B[93m';
			case 'Red':
				return '\x1B[31m';
			case 'Green':
				return '\x1B[32m';
			case 'Yellow':
				return '\x1B[33m';
			case 'Blue':
				return '\x1B[34m';
			case 'Magenta':
				return '\x1B[35m';
			case 'White':
				return '\x1B[97m';
			default:
				return '\x1B[39m';
		}
	}

	public ToBashColor(String: BashColorString) {
		return systemLibClass.TBC(String);
	}

	public ClearANSI(Log: string): string {
		return Log.replaceAll(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
	}

	public WriteStringToLog(...Log: any[]): void {
		Log.push('\n');
		const OutLog: string = Util.format(...Log);
		let CurrentLog = '';
		if (fs.existsSync(__LogFile)) {
			CurrentLog = fs.readFileSync(__LogFile).toString();
		}
		CurrentLog = CurrentLog + OutLog;
		fs.writeFileSync(__LogFile, this.ClearANSI(CurrentLog));
	}

	public DebugLog(Prefix: string, ...data: any[]) {
		if (this.DebugMode()) {
			data.addAtIndex(`${this.ToBashColor('Red')}[${Prefix.toUpperCase()}]\x1B[0m`);
			data.addAtIndex(this.ToBashColor('Magenta') + `[${new Date().toUTCString()}][DEBUG]\x1B[0m`);
			console.log(...data);
			this.WriteStringToLog(...data);
		}
	}

	public Log(Prefix: string, ...data: any[]) {
		data.addAtIndex(`${this.ToBashColor('Red')}[${Prefix.toUpperCase()}]\x1B[0m`);
		data.addAtIndex(this.ToBashColor('Cyan') + `[${new Date().toUTCString()}][LOG]\x1B[0m`);
		console.log(...data);
		this.WriteStringToLog(...data);
	}

	public LogError(Prefix: string, ...data: any[]) {
		data.addAtIndex(`${this.ToBashColor('Red')}[${Prefix.toUpperCase()}]\x1B[0m`);
		data.addAtIndex(this.ToBashColor('Light Red') + `[${new Date().toUTCString()}][ERROR]\x1B[0m`);
		console.error(...data);
		this.WriteStringToLog(...data);
	}

	public LogWarning(Prefix: string, ...data: any[]) {
		data.addAtIndex(`${this.ToBashColor('Red')}[${Prefix.toUpperCase()}]\x1B[0m`);
		data.addAtIndex(this.ToBashColor('Yellow') + `[${new Date().toUTCString()}][WARN]\x1B[0m`);
		console.warn(...data);
		this.WriteStringToLog(...data);
	}

	public LogFatal(Prefix: string, ...data: any[]) {
		data.addAtIndex(`${this.ToBashColor('Red')}[${Prefix.toUpperCase()}]\x1B[0m`);
		data.addAtIndex(this.ToBashColor('Red') + `[${new Date().toUTCString()}][FATAL]\x1B[0m`);
		console.error(...data);
		this.WriteStringToLog(...data);
		process.exit();
	}

	public CustomLog(Color: BashColorString, Key: string, IsFata: boolean, ...data: any[]) {
		data.addAtIndex(this.ToBashColor(Color) + `[${new Date().toUTCString()}][${Key}]\x1B[0m`);
		console.error(...data);
		this.WriteStringToLog(...data);
		if (IsFata) {
			process.exit();
		}
	}
}

export const BC = systemLibClass.TBC;

import {
	ApiUrl,
	MW_Auth
}                        from "@server/Lib/Express.Lib";
import { EApiAuth }      from "@shared/Enum/EApiPath";
import type {
	Request,
	Response
}                        from "express";
import {
	DefaultResponseFailed,
	DefaultResponseSuccess
}                        from "@shared/Default/Auth.Default";
import type {
	TResponse_Auth_Modify,
	TResponse_Auth_SignUp,
	TResponse_Auth_Vertify
}                        from "@shared/Types/API_Response";
import type {
	TRequest_Auth_Logout,
	TRequest_Auth_Modify,
	TRequest_Auth_SignIn,
	TRequest_Auth_SignUp
}                        from "@shared/Types/API_Request";
import DB_UserAccount    from "@server/MongoDB/DB_UserAccount";
import { CreateSession } from "@server/Lib/Session.Lib";
import { ERoles }        from "@shared/Enum/ERoles";
import DB_SessionToken   from "@server/MongoDB/DB_SessionToken";

export default function() {
	Router.post( ApiUrl( EApiAuth.validate ), MW_Auth, ( req : Request, res : Response ) => {
		res.json( {
			...DefaultResponseSuccess,
			Auth: true
		} as TResponse_Auth_Vertify );
	} );

	Router.post( ApiUrl( EApiAuth.modify ), MW_Auth, async( req : Request, res : Response ) => {
		const Response : TResponse_Auth_Modify = {
			...DefaultResponseFailed
		};

		const Request : TRequest_Auth_Modify = req.body;
		if ( Request.UserID && Request.UserClass ) {
			const Allowed = Request.UserClass.HasPermssion( ERoles.admin ) || Request.UserClass.Get._id === Request.UserID;
			if ( Allowed ) {
				try {
					const Document = ( await DB_UserAccount.findById( Request.UserID ) )!;

					if ( Request.Remove ) {
						if ( await Document.deleteOne() ) {
							Response.Success = true;
							Response.MessageCode = "User.Modify.Remove";
							return res.json( Response );
						}
					}

					else if ( Request.Data && Request.Data?.hash && Request.Data?.hash.length < 8 ) {
						return res.json( {
							...Response,
							MessageCode: "Signup.error.password.invalid"
						} );
					}
					else if ( Request.Data && Request.Data?.username && Request.Data?.username.length < 6 ) {
						return res.json( {
							...Response,
							MessageCode: "Signup.error.username.invalid"
						} );
					}
					else if ( Request.Data && Request.Data?.email && !Request.Data?.email.match( /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/ ) ) {
						return res.json( {
							...Response,
							MessageCode: "Signup.error.email.invalid"
						} );
					}

					else if ( !Request.Remove && Request.Data ) {
						delete Request.Data._id;
						delete Request.Data.__v;
						delete Request.Data.salt;
						delete Request.Data.createdAt;
						delete Request.Data.updatedAt;
						if ( !Request.UserClass.HasPermssion( ERoles.admin ) ) {
							delete Request.Data.role;
						}

						if ( Request.Data.hash ) {
							Document.setPassword( Request.Data.hash );
							delete Request.Data.hash;
						}

						for ( const [ Key, Value ] of Object.entries( Request.Data ) ) {
							Document[ Key ] = Value;
						}

						console.error( Request.Data );
						if ( await Document.save() ) {
							Response.Success = true;
							Response.MessageCode = "User.Modify";
						}
					}

					if ( Response.Success ) {
						await DB_SessionToken.deleteMany( { userid: Request.UserID } );
					}
				}
				catch ( e ) {
					if ( e instanceof Error ) {
						SystemLib.LogError( "api", e.message );
					}
				}
			}
			else {
				Response.MessageCode = "Api.error.Unauthorized";
			}
		}
		res.json( Response );
	} );

	Router.post( ApiUrl( EApiAuth.logout ), async( req : Request, res : Response ) => {
		const Request : TRequest_Auth_Logout = req.body;
		if ( Request.Token ) {
			try {
				await DB_SessionToken.findOneAndRemove( { token: Request.Token } );
			}
			catch ( e ) {
				if ( e instanceof Error ) {
					SystemLib.LogError( "api", e.message );
				}
			}
		}
		res.json( {
			...DefaultResponseSuccess,
			Auth: false
		} as TResponse_Auth_Vertify );
	} );

	Router.post( ApiUrl( EApiAuth.signup ), async( req : Request, res : Response ) => {
		const Response : TResponse_Auth_SignUp = {
			...DefaultResponseFailed
		};
		const Request : TRequest_Auth_SignUp = req.body;

		if ( !( Request.Login && Request.Password && Request.RepeatPassword && Request.EMail ) ) {
			return res.json( {
				...Response,
				MessageCode: "Signup.error.missingfield"
			} );
		}
		else if ( !( Request.Password === Request.RepeatPassword && Request.Password.length >= 8 ) ) {
			return res.json( {
				...Response,
				MessageCode: "Signup.error.password.invalid"
			} );
		}
		else if ( Request.Login.length < 6 ) {
			return res.json( {
				...Response,
				MessageCode: "Signup.error.username.invalid"
			} );
		}
		else if ( !Request.EMail.match( /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/ ) ) {
			return res.json( {
				...Response,
				MessageCode: "Signup.error.email.invalid"
			} );
		}

		const UserCount = await DB_UserAccount.count( {
			$or: [
				{ username: Request.Login },
				{ email: Request.EMail }
			]
		} );

		if ( UserCount === 0 ) {
			const NewUser = new DB_UserAccount();
			NewUser.setPassword( Request.Password );
			NewUser.email = Request.EMail;
			NewUser.username = Request.Login;
			NewUser.role = ERoles.member;
			if ( await NewUser.save() ) {
				const Token = await CreateSession( NewUser.toJSON() );
				if ( Token ) {
					Response.Success = true;
					Response.Auth = true;
					Response.MessageCode = "Auth.success.AccountCreated";
					Response.Data = { Token };
				}
			}
		}
		else {
			Response.MessageCode = "Signup.error.accountexsists";
		}

		res.json( {
			...Response,
			Auth: Response.Data?.Token !== undefined
		} );
	} );

	Router.post( ApiUrl( EApiAuth.signin ), async( req : Request, res : Response ) => {
		const Response : TResponse_Auth_SignUp = {
			...DefaultResponseFailed
		};
		const Request : TRequest_Auth_SignIn = req.body;

		if ( Request.Login && Request.Password ) {
			const User = await DB_UserAccount.findOne( {
				$or: [
					{ username: Request.Login },
					{ email: Request.Login }
				]
			} );

			if ( User ) {
				if ( User.validPassword( Request.Password ) ) {
					const Token = await CreateSession( User.toJSON() );
					if ( Token ) {
						Response.Success = true;
						Response.Auth = true;
						Response.MessageCode = "Auth.success.LoggedIn";
						Response.Data = { Token };
					}
				}
				else {
					Response.MessageCode = "Auth.error.LoginInvalid";
				}
			}
			else {
				Response.MessageCode = "Auth.error.LoginInvalid";
			}
		}

		res.json( {
			...Response,
			Auth: Response.Data?.Token !== undefined
		} );
	} );
}
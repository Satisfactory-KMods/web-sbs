import {
	ApiUrl,
	MW_Auth
}                        from "../../Lib/Express.Lib";
import { EApiAuth }      from "../../../../src/Shared/Enum/EApiPath";
import {
	Request,
	Response
}                        from "express";
import {
	DefaultResponseFailed,
	DefaultResponseSuccess
}                        from "../../../../src/Shared/Default/Auth.Default";
import {
	TResponse_Auth_Modify,
	TResponse_Auth_SignUp,
	TResponse_Auth_Vertify
}                        from "../../../../src/Shared/Types/API_Response";
import {
	TRequest_Auth_Logout,
	TRequest_Auth_Modify,
	TRequest_Auth_SignIn,
	TRequest_Auth_SignUp
}                        from "../../../../src/Shared/Types/API_Request";
import DB_UserAccount    from "../../MongoDB/DB_UserAccount";
import { CreateSession } from "../../Lib/Session.Lib";
import { ERoles }        from "../../../../src/Shared/Enum/ERoles";
import DB_SessionToken   from "../../MongoDB/DB_SessionToken";

export default function() {
	Api.post( ApiUrl( EApiAuth.validate ), MW_Auth, ( req : Request, res : Response ) => {
		res.json( {
			...DefaultResponseSuccess,
			Auth: true
		} as TResponse_Auth_Vertify );
	} );

	Api.post( ApiUrl( EApiAuth.modify ), MW_Auth, async( req : Request, res : Response ) => {
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
					console.error( e );
				}
			}
			else {
				Response.MessageCode = "Unauthorized";
			}
		}
		res.json( Response );
	} );

	Api.post( ApiUrl( EApiAuth.logout ), async( req : Request, res : Response ) => {
		const Request : TRequest_Auth_Logout = req.body;
		if ( Request.Token ) {
			try {
				await DB_SessionToken.findOneAndRemove( { token: Request.Token } );
			}
			catch ( e ) {
			}
		}
		res.json( {
			...DefaultResponseSuccess,
			Auth: false
		} as TResponse_Auth_Vertify );
	} );

	Api.post( ApiUrl( EApiAuth.signup ), async( req : Request, res : Response ) => {
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
					Response.MessageCode = "AccountCreated";
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

	Api.post( ApiUrl( EApiAuth.signin ), async( req : Request, res : Response ) => {
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
						Response.MessageCode = "LoggedIn";
						Response.Data = { Token };
					}
				}
				else {
					Response.MessageCode = "Login_Invalid";
				}
			}
			else {
				Response.MessageCode = "Login_Invalid";
			}
		}

		res.json( {
			...Response,
			Auth: Response.Data?.Token !== undefined
		} );
	} );
}
import type {
	FunctionComponent} from "react";
import {
	useEffect,
	useState
}                       from "react";
import { useAuthCheck } from "@hooks/useAuthCheck";
import { ERoles }       from "@shared/Enum/ERoles";
import {
	Button,
	Modal,
	Table
}                       from "react-bootstrap";
import { useLang }      from "@hooks/useLang";
import { useToggle }    from "@kyri123/k-reactutils";
import * as Icon        from "react-icons/bs";
import FloatInput       from "@comp/Boostrap/FloatInput";
import LoadingButton    from "@comp/Boostrap/LoadingButton";
import { API_QueryLib } from "@applib/Api/API_Query.Lib";
import {
	EApiQuestionary,
	EApiTags
}                       from "@shared/Enum/EApiPath";
import type { MO_Tag }       from "@shared/Types/MongoDB";
import AdminTagRow      from "@comp/Admin/AdminTagRow";

const Component : FunctionComponent = () => {
	const { Lang } = useLang();
	const { AuthCheckProps, AuthCheck } = useAuthCheck( { Auth: true, Role: ERoles.admin } );
	const [ ShowModal, setShowModal ] = useToggle( false );
	const [ DisplayName, setDisplayName ] = useState( "" );
	const [ IsSending, setIsSending ] = useState( false );
	const [ EditID, setEditID ] = useState( "" );
	const [ Tags, setTags ] = useState<MO_Tag[]>( [] );

	const QueryTags = async() => {
		const Result = await API_QueryLib.Qustionary<MO_Tag>( EApiQuestionary.tags, {} );
		if ( Result.Data ) {
			setTags( () => Result.Data! );
		}
	};

	useEffect( () => {
		QueryTags();
	}, [] );

	const OnEdit = ( Tag : MO_Tag ) => {
		setShowModal();
		setDisplayName( Tag.DisplayName );
		setEditID( Tag._id );
	};

	const ToggleModalWithReset = () => {
		setShowModal();
		setDisplayName( "" );
		setEditID( "" );
	};

	const HandleSubmit = async() => {
		setIsSending( true );
		const SendData : any = {
			Data: { DisplayName }
		};

		if ( EditID !== "" ) {
			SendData.Id = EditID;
		}

		const Request = await API_QueryLib.PostToAPI( EApiTags.modifytag, SendData );
		if ( Request.Success ) {
			ToggleModalWithReset();
			await QueryTags();
		}
		setIsSending( false );
	};

	const Remove = async( Id : string ) => {
		const SendData : any = {
			Id,
			Remove: true
		};

		const Request = await API_QueryLib.PostToAPI( EApiTags.modifytag, SendData );
		if ( Request.Success ) {
			await QueryTags();
		}
	};

	return (
		<>
			<AuthCheck { ...AuthCheckProps }>
				<Table striped bordered hover size="sm" variant="dark">
					<thead>
					<tr>
						<th colSpan={ 2 }>
							<h3 className="p-2 flex-1">{ Lang.Navigation.Admin_Tags }</h3>
						</th>
						<th colSpan={ 1 } className={ "text-center py-3" }>
							<Button variant="success"
							        onClick={ ToggleModalWithReset }><Icon.BsPlusLg/></Button>
						</th>
					</tr>
					<tr>
						<th className={ "px-2 text-center" }>{ Lang.AdminTags.Id }</th>
						<th className={ "px-3 text-center" }>{ Lang.AdminTags.DisplayName }</th>
						<th className={ "px-3 text-center w-0" }>{ Lang.AdminTags.Actions }</th>
					</tr>
					</thead>
					<tbody>
					{ Tags.map( R => <AdminTagRow key={ R._id } Tag={ R } onRemove={ Remove } onEdit={ OnEdit }/> ) }
					</tbody>
				</Table>
			</AuthCheck>

			<Modal show={ ShowModal } onHide={ ToggleModalWithReset } size={ "lg" }>
				<Modal.Header closeButton>
					<Modal.Title>{ EditID !== "" ? Lang.AdminTags.ModalEdit : Lang.AdminTags.ModalCreate }</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<FloatInput onChange={ V => setDisplayName( V.target.value ) }
					            value={ DisplayName }>{ Lang.AdminTags.DisplayName }</FloatInput>
				</Modal.Body>
				<Modal.Footer>
					<LoadingButton IsLoading={ IsSending } variant="success" onClick={ HandleSubmit }>
						{ EditID !== "" ? Lang.AdminTags.Edit : Lang.AdminTags.Create }
					</LoadingButton>
					<Button variant="primary" onClick={ setShowModal }>
						{ Lang.AdminTags.Close }
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export {
	Component
};

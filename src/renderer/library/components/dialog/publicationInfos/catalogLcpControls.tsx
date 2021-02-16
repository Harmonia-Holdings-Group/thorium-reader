// ==LICENSE-BEGIN==
// Copyright 2017 European Digital Reading Lab. All rights reserved.
// Licensed to the Readium Foundation under one or more contributor license agreements.
// Use of this source code is governed by a BSD-style license
// that can be found in the LICENSE file exposed on Github (readium) in the project repository.
// ==LICENSE-END==

import * as React from "react";
import { connect } from "react-redux";
import { DialogTypeName } from "readium-desktop/common/models/dialog";
import { readerActions } from "readium-desktop/common/redux/actions";
import * as dialogActions from "readium-desktop/common/redux/actions/dialog";
import { PublicationView } from "readium-desktop/common/views/publication";
import * as ArrowIcon from "readium-desktop/renderer/assets/icons/arrow-right.svg";
import * as DeleteIcon from "readium-desktop/renderer/assets/icons/baseline-close-24px.svg";
import * as LoopIcon from "readium-desktop/renderer/assets/icons/loop.svg";
import * as styles from "readium-desktop/renderer/assets/styles/bookDetailsDialog.css";
import {
    TranslatorProps, withTranslator,
} from "readium-desktop/renderer/common/components/hoc/translator";
import SVG from "readium-desktop/renderer/common/components/SVG";
import { TMouseEventOnButton } from "readium-desktop/typings/react";
import { TDispatch } from "readium-desktop/typings/redux";

import { StatusEnum } from "@r2-lcp-js/parser/epub/lsd";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IBaseProps extends TranslatorProps {
    publicationView: PublicationView;
}
// IProps may typically extend:
// RouteComponentProps
// ReturnType<typeof mapStateToProps>
// ReturnType<typeof mapDispatchToProps>
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IProps extends IBaseProps, ReturnType<typeof mapDispatchToProps> {
}

class CatalogLcpControls extends React.Component<IProps, undefined> {

    constructor(props: IProps) {
        super(props);

        this.handleRead = this.handleRead.bind(this);
        this.deletePublication = this.deletePublication.bind(this);

        this.returnPublicationDialog = this.returnPublicationDialog.bind(this);
        this.renewPublicationDialog = this.renewPublicationDialog.bind(this);
    }

    public render(): React.ReactElement<{}> {
        const { __, publicationView } = this.props;

        if (!publicationView) {
            return (<></>);
        }

        const lsdOkay = publicationView.lcp &&
            publicationView.lcp.lsd &&
            publicationView.lcp.lsd.lsdStatus;

        const lsdStatus = lsdOkay &&
            publicationView.lcp.lsd.lsdStatus.status ?
            publicationView.lcp.lsd.lsdStatus.status : undefined;

        const lsdReturnLink = (!lsdOkay || !publicationView.lcp.lsd.lsdStatus.links) ? undefined :
            publicationView.lcp.lsd.lsdStatus.links.find((link) => {
                return link.rel === "return";
            });

        const lsdRenewLink = (!lsdOkay || !publicationView.lcp.lsd.lsdStatus.links) ? undefined :
            publicationView.lcp.lsd.lsdStatus.links.find((link) => {
                return link.rel === "renew";
            });
        return (
            <>
                {(!lsdStatus ||
                (lsdStatus === StatusEnum.Active || lsdStatus === StatusEnum.Ready)) ?
                <button  onClick={this.handleRead} className={styles.lire}>{__("catalog.readBook")}</button>
                : <></>
                }
                <ul className={styles.liens}>
                    {
                        // lsdStatus === StatusEnum.Expired &&
                        lsdRenewLink &&
                        <li>
                            <button onClick={ this.renewPublicationDialog }>
                                <SVG svg={LoopIcon} ariaHidden/>
                                {__("publication.renewButton")}
                            </button>
                        </li>
                    }
                    {
                        lsdReturnLink &&
                        <li>
                            <button onClick={ this.returnPublicationDialog }>
                                <SVG svg={ArrowIcon} ariaHidden/>
                                {__("publication.returnButton")}
                            </button>
                        </li>
                    }
                    <li>
                        <button onClick={ this.deletePublication }>
                            <SVG svg={DeleteIcon} ariaHidden/>
                            {__("catalog.deleteBook")}
                        </button>
                    </li>
                </ul>
            </>
        );
    }

    private renewPublicationDialog(e: TMouseEventOnButton) {
        e.preventDefault();
        this.props.openRenewDialog();
    }
    private returnPublicationDialog(e: TMouseEventOnButton) {
        e.preventDefault();
        this.props.openReturnDialog();
    }

    private deletePublication(e: TMouseEventOnButton) {
        e.preventDefault();
        this.props.openDeleteDialog();
    }

    private handleRead(e: TMouseEventOnButton) {
        e.preventDefault();

        this.props.openReader();
    }
}

const mapDispatchToProps = (dispatch: TDispatch, props: IBaseProps) => {
    return {
        openReader: () => {
            dispatch(dialogActions.closeRequest.build());
            dispatch(readerActions.openRequest.build(props.publicationView.identifier));
        },
        openDeleteDialog: () => {
            dispatch(dialogActions.openRequest.build(DialogTypeName.DeletePublicationConfirm,
                {
                    publicationView: props.publicationView,
                },
            ));
        },
        openRenewDialog: () => {
            dispatch(dialogActions.openRequest.build(DialogTypeName.LsdRenewConfirm,
                {
                    publicationView: props.publicationView,
                },
            ));
        },
        openReturnDialog: () => {
            dispatch(dialogActions.openRequest.build(DialogTypeName.LsdReturnConfirm,
                {
                    publicationView: props.publicationView,
                },
            ));
        },
    };
};

export default connect(undefined, mapDispatchToProps)(withTranslator(CatalogLcpControls));

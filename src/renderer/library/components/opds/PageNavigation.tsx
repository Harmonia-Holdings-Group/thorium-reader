// ==LICENSE-BEGIN==
// Copyright 2017 European Digital Reading Lab. All rights reserved.
// Licensed to the Readium Foundation under one or more contributor license agreements.
// Use of this source code is governed by a BSD-style license
// that can be found in the LICENSE file exposed on Github (readium) in the project repository.
// ==LICENSE-END==

import * as React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { keyboardShortcutsMatch } from "readium-desktop/common/keyboard";
import { IOpdsResultView } from "readium-desktop/common/views/opds";
import * as ArrowRightIcon from "readium-desktop/renderer/assets/icons/baseline-arrow_forward_ios-24px.svg";
import * as ArrowLeftIcon from "readium-desktop/renderer/assets/icons/baseline-arrow_left_ios-24px.svg";
import * as styles from "readium-desktop/renderer/assets/styles/opds.css";
import {
    TranslatorProps, withTranslator,
} from "readium-desktop/renderer/common/components/hoc/translator";
import SVG from "readium-desktop/renderer/common/components/SVG";
import {
    ensureKeyboardListenerIsInstalled, registerKeyboardListener, unregisterKeyboardListener,
} from "readium-desktop/renderer/common/keyboard";
import { buildOpdsBrowserRouteWithLink } from "readium-desktop/renderer/library/opds/route";
import { ILibraryRootState } from "readium-desktop/renderer/library/redux/states";
import { dispatchHistoryPush } from "readium-desktop/renderer/library/routing";
import { TDispatch } from "readium-desktop/typings/redux";

interface IBaseProps extends TranslatorProps {
    pageLinks?: IOpdsResultView["links"];
    pageInfo?: IOpdsResultView["metadata"];
}
// IProps may typically extend:
// RouteComponentProps
// ReturnType<typeof mapStateToProps>
// ReturnType<typeof mapDispatchToProps>
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IProps extends IBaseProps, ReturnType<typeof mapStateToProps>, ReturnType<typeof mapDispatchToProps> {
}

class PageNavigation extends React.Component<IProps, undefined> {

    constructor(props: IProps) {
        super(props);

        this.onKeyboardPageNavigationPrevious = this.onKeyboardPageNavigationPrevious.bind(this);
        this.onKeyboardPageNavigationNext = this.onKeyboardPageNavigationNext.bind(this);
    }

    public componentDidMount() {
        ensureKeyboardListenerIsInstalled();
        this.registerAllKeyboardListeners();
    }

    public componentWillUnmount() {
        this.unregisterAllKeyboardListeners();
    }

    public async componentDidUpdate(oldProps: IProps) {
        if (!keyboardShortcutsMatch(oldProps.keyboardShortcuts, this.props.keyboardShortcuts)) {
            this.unregisterAllKeyboardListeners();
            this.registerAllKeyboardListeners();
        }
    }

    public render() {
        const { pageLinks, pageInfo, __ } = this.props;

        const buildRoute = buildOpdsBrowserRouteWithLink(this.props.location.pathname);

        return (
            <div className={styles.opds_page_navigation}>
                <span />
                {
                    pageLinks?.first[0]?.url
                    && <Link to={{
                        ...this.props.location,
                        pathname: buildRoute(pageLinks.first[0]),
                    }}>
                        <button>
                            {__("opds.firstPage")}
                        </button>
                    </Link>
                }
                {
                    pageLinks?.previous[0]?.url
                    && <Link to={{
                        ...this.props.location,
                        pathname: buildRoute(pageLinks.previous[0]),
                    }}>
                        <button>
                            <SVG svg={ArrowLeftIcon} />
                            {__("opds.previous")}
                        </button>
                    </Link>
                }
                {
                    pageLinks?.next[0]?.url
                    && <Link to={{
                        ...this.props.location,
                        pathname: buildRoute(pageLinks.next[0]),
                    }}>
                        <button>
                            {__("opds.next")}
                            <SVG svg={ArrowRightIcon} />
                        </button>
                    </Link>
                }
                {
                    pageLinks?.last[0]?.url
                    && <Link to={{
                        ...this.props.location,
                        pathname: buildRoute(pageLinks.last[0]),
                    }}>
                        <button>
                            {__("opds.lastPage")}
                        </button>
                    </Link>
                }
                {
                    pageInfo?.currentPage
                    && pageInfo.numberOfItems
                    && pageInfo.itemsPerPage
                    && <span className={styles.page_count}>
                        {
                            pageInfo.currentPage
                        } / {
                            Math.ceil(pageInfo.numberOfItems / pageInfo.itemsPerPage)
                        }
                    </span>
                }
            </div>
        );
    }

    private registerAllKeyboardListeners() {
        registerKeyboardListener(
            false, // listen for key down (not key up)
            this.props.keyboardShortcuts.NavigatePreviousOPDSPage,
            this.onKeyboardPageNavigationPrevious);
        registerKeyboardListener(
            false, // listen for key down (not key up)
            this.props.keyboardShortcuts.NavigateNextOPDSPage,
            this.onKeyboardPageNavigationNext);

        registerKeyboardListener(
            false, // listen for key down (not key up)
            this.props.keyboardShortcuts.NavigatePreviousOPDSPageAlt,
            this.onKeyboardPageNavigationPrevious);
        registerKeyboardListener(
            false, // listen for key down (not key up)
            this.props.keyboardShortcuts.NavigateNextOPDSPageAlt,
            this.onKeyboardPageNavigationNext);
    }

    private unregisterAllKeyboardListeners() {
        unregisterKeyboardListener(this.onKeyboardPageNavigationPrevious);
        unregisterKeyboardListener(this.onKeyboardPageNavigationNext);
    }

    private onKeyboardPageNavigationNext = () => {
        this.onKeyboardPageNavigationPreviousNext(false);
    }
    private onKeyboardPageNavigationPrevious = () => {
        this.onKeyboardPageNavigationPreviousNext(true);
    }
    private onKeyboardPageNavigationPreviousNext = (isPrevious: boolean) => {
        const { pageLinks } = this.props;

        const buildRoute = buildOpdsBrowserRouteWithLink(this.props.location.pathname);

        if (pageLinks?.previous[0]?.url && isPrevious) { // TODO RTL
            this.props.historyPush({
                ...this.props.location,
                pathname: buildRoute(pageLinks.previous[0]),
            });
        } else if (pageLinks?.next[0]?.url) { // TODO RTL
            this.props.historyPush({
                ...this.props.location,
                pathname: buildRoute(pageLinks.next[0]),
            });
        }
    }
}

const mapStateToProps = (state: ILibraryRootState) => ({
    location: state.router.location,
    keyboardShortcuts: state.keyboard.shortcuts,
});

const mapDispatchToProps = (dispatch: TDispatch) => ({
    historyPush: dispatchHistoryPush(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTranslator(PageNavigation));

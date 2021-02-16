// ==LICENSE-BEGIN==
// Copyright 2017 European Digital Reading Lab. All rights reserved.
// Licensed to the Readium Foundation under one or more contributor license agreements.
// Use of this source code is governed by a BSD-style license
// that can be found in the LICENSE file exposed on Github (readium) in the project repository.
// ==LICENSE-END==

import classNames from "classnames";
import * as debug_ from "debug";
import * as React from "react";
import { I18nTyped } from "readium-desktop/common/services/translator";
import { TPublication } from "readium-desktop/common/type/publication.type";
import * as styles from "readium-desktop/renderer/assets/styles/bookDetailsDialog.css";

// Logger
const debug = debug_("readium-desktop:renderer:publicationInfoDescription");
debug("_");

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IProps {
    publication: TPublication;
    __: I18nTyped;
}

interface IState {
    seeMore: boolean;
    needSeeMore: boolean;
}

export default class PublicationInfoDescription extends React.Component<IProps, IState> {

    private descriptionWrapperRef: React.RefObject<HTMLDivElement>;
    private descriptionRef: React.RefObject<HTMLParagraphElement>;

    constructor(props: IProps) {
        super(props);

        this.descriptionWrapperRef = React.createRef<HTMLDivElement>();
        this.descriptionRef = React.createRef<HTMLParagraphElement>();

        this.state = {
            seeMore: false,
            needSeeMore: false,
        };
    }

    public componentDidMount() {
        setTimeout(this.needSeeMoreButton, 500);
    }

    public componentDidUpdate(prevProps: IProps) {

        if (this.props.publication !== prevProps.publication) {
            setTimeout(this.needSeeMoreButton, 500);
        }
    }

    public render() {
        const { publication, __ } = this.props;

        if (publication.description) {
            return (
                <>
                    <h3>{__("catalog.description")}</h3>
                    <div
                        ref={this.descriptionWrapperRef}
                        className={classNames(
                            styles.descriptionWrapper,
                            this.state.needSeeMore && styles.hideEnd,
                            this.state.seeMore && styles.seeMore,
                        )}
                    >
                        <p
                            ref={this.descriptionRef}
                            className={classNames(styles.allowUserSelect, styles.description)}
                        >
                            {publication.description}
                        </p>
                    </div>
                    {
                        this.state.needSeeMore &&
                        <button aria-hidden className={styles.seeMoreButton} onClick={this.toggleSeeMore}>
                            {
                                this.state.seeMore
                                    ? __("publication.seeLess")
                                    : __("publication.seeMore")
                            }
                        </button>
                    }
                </>
            );
        }

        return (<></>);
    }

    private needSeeMoreButton = () => {
        if (!this.descriptionWrapperRef?.current || !this.descriptionRef?.current) {
            return;
        }
        const need = this.descriptionWrapperRef.current.offsetHeight < this.descriptionRef.current.offsetHeight;
        this.setState({ needSeeMore: need });
    }

    private toggleSeeMore = () =>
        this.setState({
            seeMore: !this.state.seeMore,
        })
}

// ==LICENSE-BEGIN==
// Copyright 2017 European Digital Reading Lab. All rights reserved.
// Licensed to the Readium Foundation under one or more contributor license agreements.
// Use of this source code is governed by a BSD-style license
// that can be found in the LICENSE file exposed on Github (readium) in the project repository.
// ==LICENSE-END==

import * as React from "react";
import { connect } from "react-redux";
import { i18nActions } from "readium-desktop/common/redux/actions/";
import { AvailableLanguages } from "readium-desktop/common/services/translator";
import * as DoneIcon from "readium-desktop/renderer/assets/icons/done.svg";
import * as styles from "readium-desktop/renderer/assets/styles/settings.css";
import {
    TranslatorProps, withTranslator,
} from "readium-desktop/renderer/common/components/hoc/translator";
import { ILibraryRootState } from "readium-desktop/renderer/library/redux/states";
import { TDispatch } from "readium-desktop/typings/redux";
import { ObjectKeys } from "readium-desktop/utils/object-keys-values";

import SVG from "../../../common/components/SVG";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IBaseProps extends TranslatorProps {
}
// IProps may typically extend:
// RouteComponentProps
// ReturnType<typeof mapStateToProps>
// ReturnType<typeof mapDispatchToProps>
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IProps extends IBaseProps, ReturnType<typeof mapStateToProps>, ReturnType<typeof mapDispatchToProps> {
}

class LanguageSettings extends React.Component<IProps, undefined> {

    public render(): React.ReactElement<{}> {
        const { __ } = this.props;
        return (
            <>
            <h3>{ __("settings.language.languageChoice")}</h3>
            <form className={styles.languages_list}>
                    { ObjectKeys(AvailableLanguages).map((lang, i) =>
                        <div key={i}>
                            <input
                                id={"radio-" + lang}
                                type="radio"
                                lang={lang}
                                name="language"
                                onChange={() => this.props.setLocale(lang)}
                                checked={this.props.locale === lang}
                            />
                            <label htmlFor={"radio-" + lang}>
                                { this.props.locale === lang && <SVG svg={DoneIcon} ariaHidden/>}
                                { AvailableLanguages[lang] }
                            </label>
                        </div>,
                    )}
            </form>
            </>
        );
    }
}

const mapStateToProps = (state: ILibraryRootState, _props: IBaseProps) => {
    return {
        locale: state.i18n.locale,
    };
};

const mapDispatchToProps = (dispatch: TDispatch, _props: IBaseProps) => {
    return {
        setLocale: (locale: string) => dispatch(i18nActions.setLocale.build(locale)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslator(LanguageSettings));

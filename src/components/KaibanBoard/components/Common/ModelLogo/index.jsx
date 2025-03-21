/* eslint-disable react/prop-types */
import React from 'react';
import {Anthropic, Google, Mistral, OpenAI} from "../../../assets/models";

const ModelLogo = ({ model, size }) => {
    const modelIcons = {
        anthropic: Anthropic,
        openai: OpenAI,
        google: Google,
        mistral: Mistral,
    };

    const IconComponent = modelIcons[model];

    return (
        <>
            {IconComponent ? <IconComponent size={size} /> : null}
        </>
    );
};

export default ModelLogo;
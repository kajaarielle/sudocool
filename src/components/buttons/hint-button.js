import { useCallback } from 'react';

import ButtonIcon from '../svg-sprites/button-icon';

export default function HintButton ({menuHandler}) {
    const clickHandler = useCallback(
        e => {
            e.preventDefault();
            const menuAction = 'show-hint-modal';
            menuHandler(menuAction);
            console.log('click hint ')
        },
        [menuHandler]
    );

    return (
        <button disabled={false} id="hint-button" type="button" title="Hint" onClick={clickHandler}>
            <ButtonIcon name="hint" />
        </button>
    )
}

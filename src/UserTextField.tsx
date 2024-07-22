import React from "react";
import {TextField} from '@mui/material';

interface UTFProps {
    placeholder: string
    onAccept: (text: string) => any
    sx: any
}

interface UTFState {
    text: string
}

class UserTextField extends React.Component<UTFProps, UTFState> {

    constructor(props: any) {
        super(props);
        this.state = {
            text: ""
        }
    }

    render() {
        return (
            <TextField
                onChange={(event) => this.setState({text: event.target.value})}
                onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                        this.props.onAccept(this.state.text)
                    }
                }}
                placeholder={this.props.placeholder}
                sx={this.props.sx}
            />
        );
    }
}

export default UserTextField;
import React from "react";
import {ButtonBase, Card, Box, Typography, Divider, Stack, IconButton} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Note from "./Note";

interface NoteProps {
    note: Note
    onClick: (phrase: string) => any
    onClear: (phrase: string) => any
}

class NoteCard extends React.Component<NoteProps, {}> {

    render() {
        return (
            <Card variant="outlined" sx={{maxWidth: 360, mb: "10px"}}>
                <Box sx={{p: 2}}>
                    <ButtonBase
                        onClick={() => this.props.onClick(this.props.note.phrase)}
                        disabled={this.props.note.disabled}
                    >
                        <Typography
                            gutterBottom
                            variant="h5"
                            component="div"
                            sx={{textAlign: "left"}}
                        >
                            {this.props.note.phrase}
                        </Typography>
                    </ButtonBase>
                </Box>
                <Divider />
                <Box sx={{ p: 2 }}>
                    {
                        !this.props.note.annotation &&
                        <Typography color="darkgray" variant="body2">
                            Annotate phrase or leave blank to accept ambiguity
                        </Typography>
                    }
                    {
                        this.props.note.annotation &&
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="body2">
                                {this.props.note.annotation}
                            </Typography>
                            <IconButton onClick={() => this.props.onClear(this.props.note.phrase)}>
                                <CloseIcon/>
                            </IconButton>
                        </Stack>
                    }
                </Box>
            </Card>
        );
    }
}

export default NoteCard;
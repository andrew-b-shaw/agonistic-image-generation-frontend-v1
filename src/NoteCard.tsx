import React from "react";
import {ButtonBase, Card, Box, Typography, Divider, Stack, IconButton} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface NoteProps {
    term: string
    annotation: string
    onClick: (term: string) => any
    onClear: (term: string) => any
}

class NoteCard extends React.Component<NoteProps, {}> {

    render() {
        return (
            <Card variant="outlined" sx={{maxWidth: 360, mb: "10px"}}>
                <Box sx={{p: 2}}>
                    <ButtonBase onClick={() => this.props.onClick(this.props.term)}>
                        <Typography
                            gutterBottom
                            variant="h5"
                            component="div"
                            sx={{textAlign: "left"}}
                        >
                            {this.props.term}
                        </Typography>
                    </ButtonBase>
                </Box>
                <Divider />
                <Box sx={{ p: 2 }}>
                    {
                        !this.props.annotation &&
                        <Typography color="darkgray" variant="body2">
                            Annotate term or leave blank to accept ambiguity
                        </Typography>
                    }
                    {
                        this.props.annotation &&
                        <Stack direction="row" justifyContent="space-between" alignItems="center">

                            <Typography variant="body2">
                                {this.props.annotation}
                            </Typography>
                            <IconButton onClick={() => this.props.onClear(this.props.term)}>
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
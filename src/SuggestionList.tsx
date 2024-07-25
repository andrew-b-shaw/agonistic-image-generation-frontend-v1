import React from "react";
import {
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails, Button
} from '@mui/material';
import Suggestion from "./Suggestion";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface SuggestionProps {
    phrase: string
    suggestions: Suggestion[]
    onAccept: (suggestion: string) => any
}

interface SuggestionsState {
    expanded: string | false
}

class SuggestionList extends React.Component<SuggestionProps, SuggestionsState> {

    constructor(props: any) {
        super(props);
        this.state = {
            expanded: false
        };
    }

    handleChange = (text: string) =>
        (event: React.SyntheticEvent, isExpanded: boolean) => {
            this.setState({
                expanded: isExpanded ? text : false
            });
        };

    render() {
        return (
            <div>
                {this.props.suggestions.map((suggestion) => (
                    <Accordion
                        expanded={this.state.expanded === suggestion.text}
                        onChange={this.handleChange(suggestion.text)}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1bh-content"
                            id="panel1bh-header"
                        >
                            <Typography>
                                {suggestion.text}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography sx={{color: 'text.secondary'}}>
                                {suggestion.explanation}
                            </Typography>
                            <Button onClick={() => {window.open(suggestion.source); console.log(suggestion.source)}}>
                                Learn More
                            </Button>
                            <Button onClick={() => this.props.onAccept(suggestion.text)}>
                                Accept
                            </Button>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </div>
        )
    }
}

export default SuggestionList;
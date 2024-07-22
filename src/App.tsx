import React from "react";
import NoteCard from "./NoteCard";
import {TextField, CssBaseline, Button, CircularProgress, Modal, Box} from "@mui/material";
import SuggestionGraph from "./SuggestionGraph";
import UserTextField from "./UserTextField";

interface AppState {
    prompt: string
    notes: any // Map of term (string) to annotation (string)
    suggestions: any // Map of term (string) to array of Suggestions
    focus: string
    image: string
    modalOpen: boolean
    notesLoading: boolean
}

class App extends React.Component<{}, AppState> {

    constructor(props: any) {
        super(props);
        this.state = {
            prompt: "",
            notes: {},
            suggestions: {},
            focus: "",
            image: "",
            modalOpen: false,
            notesLoading: false,
        }
    }

    handlePromptAccept = async (text: string) => {
        this.setState({
            focus: "",
            image: "",
            notesLoading: true,
            prompt: text
        });

        let response = await fetch("http://127.0.0.1:5000/negotiate/" + text);
        let notes: object = {}
        let suggestions = await response.json();

        for (let term in suggestions) {
            // @ts-ignore
            notes[term] = "";
        }

        this.setState({
            notes: notes,
            suggestions: suggestions,
            notesLoading: false
        });
    }

    handleNoteClick = (term: string) => {
        this.setState({focus: term});
    }

    handleSuggestionAccept = async (text: string) => {
        let notes = {...this.state.notes};
        notes[this.state.focus] = text;
        this.setState({
            notes: notes,
            focus: "",
            //notesLoading: true
        })

        // let formData = new FormData();
        // formData.append("annotation", text)
        // // @ts-ignore
        // formData.append("prompt", this.state.prompt);
        // formData.append("notes", JSON.stringify(this.state.notes));
        //
        // let response = await fetch("http://127.0.0.1:5000/iterate", {
        //     method: 'POST',
        //     body: formData
        // });
        //
        // let suggestions = await response.json();
        // for (let term in suggestions) {
        //     if (!Object.hasOwn(this.state.notes, term)) {
        //         this.state.notes[term] = "";
        //         this.state.suggsetions[term] = suggestions[term];
        //     }
        // }
        //
        // this.setState({
        //     notes: {...this.state.notes},
        //     suggestions: {...this.state.suggestions},
        //     notesLoading: false
        // });
    }

    handleGenerate = async () => {
        this.setState({
            image: "",
            modalOpen: true
        });

        let formData = new FormData();
        // @ts-ignore
        formData.append("prompt", this.state.prompt);
        formData.append("notes", JSON.stringify(this.state.notes));

        let response = await fetch("http://127.0.0.1:5000/generate", {
            method: 'POST',
            body: formData
        });

        let image = await response.text();
        this.setState({
            image: image
        });
    }

    handleNoteClear = (term: string) => {
        this.state.notes[term] = "";
        this.setState({notes: {...this.state.notes}});
    }

    handleNoteAdd = (term: string) => {
        let notes = {...this.state.notes}
        let suggestions = {...this.state.suggestions}

        notes[term] = "";
        suggestions[term] = [];

        this.setState({
            notes: notes,
            suggestions: suggestions
        });
    }

    render() {
        return (
            <div className="root">
                <CssBaseline/>

                <UserTextField
                    placeholder="Enter prompt here..."
                    onAccept={this.handlePromptAccept}
                    sx={{width: 1}}
                />

                {this.state.prompt &&
                    <div className="interface-container">
                        <div className="grid-container">
                            <div className="notes grid-item">
                                <h1>Notes</h1>
                                {Object.keys(this.state.notes).length > 0 && (
                                    <div>
                                        {Object.keys(this.state.notes).map(term => (
                                            <NoteCard
                                                term={term}
                                                annotation={this.state.notes[term]}
                                                onClick={this.handleNoteClick}
                                                onClear={this.handleNoteClear}
                                            />
                                        ))}
                                        {/*<UserTextField*/}
                                        {/*    placeholder="Enter your own note..."*/}
                                        {/*    onAccept={this.handleNoteAdd}*/}
                                        {/*/>*/}
                                    </div>
                                )}
                                {this.state.notesLoading && <CircularProgress sx={{my: 2}}/>}
                            </div>

                            <div className="suggestions grid-item">
                                <h1>Suggestions</h1>
                                {this.state.focus && (
                                    <div>
                                        <SuggestionGraph
                                            phrase={this.state.focus}
                                            suggestions={this.state.suggestions[this.state.focus]}
                                            onAccept={this.handleSuggestionAccept}
                                        />
                                        <UserTextField
                                            placeholder="Enter your own annotation..."
                                            onAccept={this.handleSuggestionAccept}
                                            sx={{width: 400}}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <Button
                            variant="contained"
                            onClick={this.handleGenerate}
                            disabled={this.state.prompt == null}
                            sx={{my: 2}}
                        >
                            Generate
                        </Button>

                        <Modal
                            open={this.state.modalOpen}
                            onClose={(e) => this.setState({modalOpen: false})}
                        >
                            <Box sx={{
                                height: 0.5,
                                width: 0.5,
                                position: "absolute",
                                top: 0,
                                bottom: 0,
                                left: 0,
                                right: 0,
                                margin: "auto"
                            }}>
                                {this.state.image === "" && <CircularProgress sx={{
                                    position: "absolute",
                                    m: "auto",
                                    top: 0,
                                    bottom: 0,
                                    left: 0,
                                    right: 0
                                }}/>}
                                {this.state.image != "" &&
                                    <img
                                        src={this.state.image}
                                        alt={this.state.prompt}
                                        className="generated-img"
                                        style={{
                                            height: "100%",
                                            width: "100%",
                                            objectFit: "contain"
                                    }}
                                    />
                                }
                            </Box>
                        </Modal>
                    </div>
                }
            </div>
        );
    }
}

export default App;
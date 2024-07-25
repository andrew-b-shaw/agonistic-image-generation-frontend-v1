import React from "react";
import NoteCard from "./NoteCard";
import {CssBaseline, Button, CircularProgress, Modal, Box} from "@mui/material";
import SuggestionList from "./SuggestionList";
import UserTextField from "./UserTextField";
import Suggestion from "./Suggestion";
import Note from "./Note";

const URL: string = "http://127.0.0.1:5000/"; // "https://app-cqcqomtita-wl.a.run.app/";

interface AppState {
    prompt: string
    notes: {[k: string]: Note} // Map of phrase (string) to array of Notes
    suggestions: {[k: string]: Suggestion[]} // Map of phrase (string) to array of Suggestions
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

        let response = await fetch(URL + "negotiate/" + text);
        let notes: {[k: string]: Note} = {}
        let suggestions: {[k: string]: Suggestion[]} = await response.json();

        for (let phrase in suggestions) {
            notes[phrase] = {
                phrase: phrase,
                annotation: "",
                disabled: false
            };
        }

        this.setState({
            notes: notes,
            suggestions: suggestions,
            notesLoading: false
        });
    }

    handleNoteClear = (phrase: string) => {
        let notes = {...this.state.notes};
        notes[phrase].annotation = "";
        this.setState({notes: notes});
    }

    handleNoteAdd = (phrase: string) => {
        if (!Object.hasOwn(this.state.notes, phrase)) {
            let notes = {...this.state.notes}
            let suggestions = {...this.state.suggestions}

            notes[phrase] = {
                phrase: phrase,
                annotation: "",
                disabled: false
            };
            suggestions[phrase] = [];

            this.setState({
                notes: notes,
                suggestions: suggestions
            });
        }
    }

    handleSuggestionAccept = async (text: string) => {
        let notes = {...this.state.notes};
        notes[this.state.focus].annotation = text;
        this.setState({
            notes: notes,
            focus: "",
        })
    }

    handleGenerate = async () => {
        this.setState({
            image: "",
            modalOpen: true
        });

        let formData = new FormData();
        formData.append("prompt", this.state.prompt);
        formData.append("notes", JSON.stringify(this.state.notes));

        let response = await fetch(URL + "generate", {
            method: 'POST',
            body: formData
        });

        let image = await response.text();
        this.setState({
            image: image
        });
    }


    // handleIterate = async () => {
    //     let formData = new FormData();
    //     formData.append("prompt", this.state.prompt);
    //     formData.append("notes", JSON.stringify(this.state.notes));
    //
    //     let response = await fetch(URL + "iterate", {
    //         method: 'POST',
    //         body: formData
    //     });
    //
    //     let notes = {...this.state.notes};
    //     let suggestions = {...this.state.suggestions};
    //     for (let phrase in Object.keys(notes)) {
    //         notes[phrase].disabled = true;
    //     }
    //
    //     let new_suggestions: {[k: string]: Suggestion[]} = await response.json();
    //     for (let phrase in new_suggestions) {
    //         if (!Object.hasOwn(this.state.notes, phrase)) {
    //             this.state.notes[phrase] = {
    //                 phrase: phrase,
    //                 annotation: "",
    //                 disabled: false
    //             };
    //             suggestions[phrase] = new_suggestions[phrase];
    //         }
    //     }
    //
    //     this.setState({
    //         notes: {...this.state.notes},
    //         suggestions: {...this.state.suggestions},
    //         notesLoading: false
    //     });
    // }

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
                                        {Object.values(this.state.notes).map(note => (
                                            <NoteCard
                                                note={note}
                                                onClick={(phrase) => this.setState({focus: phrase})}
                                                onClear={this.handleNoteClear}
                                            />
                                        ))}
                                        <UserTextField
                                            placeholder="Enter your own note..."
                                            onAccept={this.handleNoteAdd}
                                            sx={{width: 400}}
                                        />
                                    </div>
                                )}
                                {this.state.notesLoading && <CircularProgress sx={{my: 2}}/>}
                            </div>

                            <div className="suggestions grid-item">
                                <h1>Suggestions</h1>
                                {this.state.focus && (
                                    <div>
                                        <SuggestionList
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
                            onClose={() => this.setState({modalOpen: false})}
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
                                {this.state.image !== "" && <img
                                    src={this.state.image}
                                    alt={this.state.prompt}
                                    className="generated-img"
                                    style={{
                                        height: "100%",
                                        width: "100%",
                                        objectFit: "contain"
                                    }}
                                />}
                            </Box>
                        </Modal>
                    </div>
                }
            </div>
        );
    }
}

export default App;
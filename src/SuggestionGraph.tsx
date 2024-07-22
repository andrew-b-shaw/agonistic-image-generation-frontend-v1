import React, {useState} from "react";
import * as d3 from "d3";
import Suggestion from "./Suggestion";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {Box, Button, ButtonBase, Card, Divider, IconButton, Stack, Tooltip, Typography} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import UserTextField from "./UserTextField";
import Gradient from "javascript-color-gradient";

interface SuggestionProps {
    phrase: string
    suggestions: Suggestion[]
    onAccept: (suggestion: string) => any
}

interface SuggestionsState {
    focus: number
    hover: number | false
}

class SuggestionGraph extends React.Component<SuggestionProps, SuggestionsState> {
    gradient: string[];

    constructor(props: any) {
        super(props);
        this.state = {
            focus: this.props.suggestions.length - 2,
            hover: false
        };

        this.gradient = new Gradient()
            .setColorGradient(
                // "#0000ff",
                "#008000",
                "#ffff00",
                "#ffa500",
                "#ff0000"
            )
            .setMidpoint(100)
            .getColors()
    }

    color = (x: number, y: number, width: number, height: number) => {
        let max_dist: number = Math.sqrt((width / 2) ** 2 + (height / 2) ** 2);
        let dist: number = Math.sqrt(x ** 2 + y ** 2);
        let r: number = dist / max_dist;
        return this.gradient[Math.round(r * (this.gradient.length - 1))];
    }

    render() {
        let curr = this.props.suggestions[this.state.focus];
        let xMags: number[] = this.props.suggestions.map(s => Math.abs(s.x));
        let yMags: number[] = this.props.suggestions.map(s => Math.abs(s.y));

        let width: number = 400;
        let height: number = 400;
        let x = d3.scaleLinear([-Math.max(...xMags), Math.max(...xMags)], [50, width - 50]);
        let y = d3.scaleLinear([-Math.max(...yMags), Math.max(...yMags)], [50, height - 50]);

        return (
            <div className="suggestion-graph-container">
                <svg width={width} height={height} style={{border: "1px solid"}}>
                    <g fill="white" stroke="currentColor" strokeWidth="1.5">
                        {this.props.suggestions.map((s, i) => (
                            <line
                                x1={x(s.x)}
                                y1={y(s.y)}
                                x2={x(0)}
                                y2={y(0)}
                            />
                        ))}
                        <Tooltip title={this.props.phrase}>
                            <circle
                                key={-1}
                                r={this.state.hover === -1 || this.state.focus === -1 ? 8 : 7} // radius
                                cx={x(0)} // position on the X axis
                                cy={y(0)} // position on the Y axis
                                opacity={1}
                                stroke={this.state.hover === -1 || this.state.focus === -1 ? "blue" : "black"}
                                fill='gray'
                                fillOpacity={1}
                                strokeWidth={this.state.hover === -1 || this.state.focus === -1 ? 3 : 1}
                            />
                        </Tooltip>
                        {this.props.suggestions.map((s, i) => (
                            <Tooltip title={s.text}>
                                <circle
                                    key={i}
                                    r={this.state.hover === i || this.state.focus === i ? 8 : 7} // radius
                                    cx={x(s.x)} // position on the X axis
                                    cy={y(s.y)} // position on the Y axis
                                    opacity={1}
                                    stroke={this.state.hover === i || this.state.focus === i ? "blue" : "black"}
                                    fill={this.color(x(s.x) - width / 2, y(s.y) - height / 2, width - 100, height - 100)}
                                    fillOpacity={1}
                                    strokeWidth={this.state.hover === i || this.state.focus === i ? 3 : 1}
                                    onClick={(e) => this.setState({focus: i})}
                                    onMouseOver={(e) => this.setState({hover: i})}
                                    onMouseOut={(e) => this.setState({hover: false})}
                                />
                            </Tooltip>
                        ))}
                    </g>
                </svg>
                <div className = "suggestion-card-container" style={{
                    height: "300px",
                    display: "table-cell",
                    verticalAlign: "bottom"
                }}>
                    <Card variant="outlined" sx={{
                        width: 400,
                        mb: "10px"
                    }}>
                        <Box sx={{p: 2}}>
                            <Typography
                                gutterBottom
                                variant="h5"
                                component="div"
                                sx={{textAlign: "left"}}
                            >
                                {curr.text}
                            </Typography>
                        </Box>
                        <Divider/>
                        <Box sx={{p: 2}}>
                            <Typography sx={{color: 'text.secondary'}}>{curr.explanation}</Typography>
                            <Button onClick={() => window.open(curr.link)}>Learn More</Button>
                            <Button onClick={() => this.props.onAccept(curr.text)}>Accept</Button>
                        </Box>
                    </Card>
                </div>
            </div>
        );
    }
}

export default SuggestionGraph;
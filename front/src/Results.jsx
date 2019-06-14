import React from "react"
import {observer} from "mobx-react";
import {Column, Columns, Icon, Subtitle} from "bloomer";
import {post_results} from "./api";

class Results extends React.Component {


    render() {

        const eyes = [...this.props.eyes.first, ...this.props.eyes.second];

        post_results(eyes.map(eye => ({
            omni_id: eye.omni_id,
            colour: eye.colour,
            sentiment: eye.sentiment
        })));


        return <Columns>
            <Column>

                <p>Thanks for participating in this small experiment!</p>

                <br/>



            </Column>


        </Columns>
    }
}


export default observer(Results);

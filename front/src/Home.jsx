import {Button, Column, Columns, Heading} from "bloomer";
import React from "react";
import {observer} from "mobx-react";
import {observable} from "mobx";
import {get_evaluation_sample} from "./api";


class Home extends React.Component {
    isLoading = observable({isStartLoading: false});



    onStartClick = async () => {
        this.isLoading.isStartLoading = true;

        const sample = {first: await get_evaluation_sample(), second: await get_evaluation_sample()};

        this.isLoading.isStartLoading = false;

        this.props.onStartFinished(sample)
    };

    render() {
        return <Columns>
            <Column isSize={6}>
                <p>
                    Hi! My thesis is about finding out whether there is a relationship between eye colour and
                    sentiment in portrait painting. My system finds faces from the <a
                    href={"http://isis-data.science.uva.nl/strezoski/#2"}>OmniArt</a> dataset and determines
                    their eye colour and sentiment.

                    <br/>
                    The best way to evaluate this system is to let humans determine the eye colour and sentiment.<br/>
                    So, in this small experiment you, the art connoisseur, are tasked with selecting the appropriate
                    eye colour and sentiment.
                </p>
            </Column>
            <Column isSize={6} hasTextAlign={'centered'}>
                <Button isSize='large' isColor={'primary'} onClick={this.onStartClick}
                        isLoading={this.isLoading.isStartLoading}>
                    Start
                </Button>
                {this.isLoading.isStartLoading && <Heading>Finding faces...</Heading>}
            </Column>
        </Columns>;
    }
}


export default observer(Home)

import {observer} from "mobx-react";

import {Button, Column, Columns, Subtitle} from "bloomer";
import React from "react";
import {observable} from "mobx";

class Task extends React.Component {

    phase = observable.box('first');

    onEyeClick = eye => {
        eye.deemed_fake = !eye.deemed_fake;
    };

    next = () => {
        if (this.phase.get() === 'first') {
            this.phase.set('second');
        } else {
            this.props.onFinish();
        }
    };



    render() {
        const eyes = this.props.sample[this.phase.get()];
        const selectable_colors = ['BlueGray', 'Brown', 'DarkBrown', 'Gray', 'Green', 'Hazel']
        const selectable_sents = ['Angry', 'Content', 'Disdain', 'Disgust', 'Fear', 'Happy', 'Neutral', 'Sad', 'Suspicion']
        return <Columns>


            <Column isSize={12} hasTextAlign={'centered'}>

                {this.phase.get() === 'first' &&
                <Subtitle>Select the eye colour and sentiment that you think <strong>fit best to the face</strong>.</Subtitle>
                }
                {this.phase.get() === 'second' &&
                <Subtitle>Again, select the eye colour and sentiment that you think <strong>fit best to the face</strong>. After this you are
                    done.</Subtitle>
                }

                <Columns isMultiline>



                    {eyes.map((eye, index) => {
                        const style = {cursor: 'pointer'};
                        return <Column key={index} isSize={12}>
                            <Columns>
                                <Column isSize={6}>
                                <img style={style}
                                     src={'data:image/jpeg;base64, ' + eye.image} alt={''}/>

                                </Column>
                                <Column isSize={3}>
                                    {selectable_colors.map(color => <Button isColor={eye.colour === color ? 'primary' : 'light'} style={{display: 'block'}} onClick={() => eye.colour = color} key={color}>{color}</Button>)}
                                </Column>
                                <Column isSize={3}>
                                    {selectable_sents.map(sentiment => <Button isColor={eye.sentiment === sentiment ? 'primary' : 'light'} style={{display: 'block'}} onClick={() => eye.sentiment = sentiment} key={sentiment}>{sentiment}</Button>)}
                                </Column>

                                </Columns>
                            </Column>
                    })}
                </Columns>

                <Button isSize='large' isColor={'primary'} onClick={this.next}>
                    {this.phase.get() === 'first' && 'Next'}
                    {this.phase.get() === 'second' && 'Finish'}
                </Button>


            </Column>
        </Columns>
    }
}


export default observer(Task)

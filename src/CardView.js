import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  ImageBackground,
  Image,
  Text,
  StyleSheet,
  Platform,
  Dimensions
} from "react-native";

import defaultIcons from "./Icons";
import FlipCard from "react-native-flip-card";

const BASE_SIZE = { width: 320, height: 200 };

const s = StyleSheet.create({
  cardContainer: {
    // backgroundColor:"black",
    width:Dimensions.get("window").width
  },
  cardFace: {},
  icon: {
    position: "absolute",
    top: 30,
    right: 15,
    width: 40,
    height: 40,
    // resizeMode: "contain",
  },
  baseText: {
    color: "rgba(255, 255, 255, 0.8)",
    backgroundColor: "transparent",
  },
  placeholder: {
    color: "rgba(255, 255, 255, 0.5)",
  },
  focused: {
    fontWeight: "bold",
    color: "rgba(255, 255, 255, 1)",
  },
  cardtype: {
    fontSize: 14,
    position: "absolute",
    top: 30,
    left:30,
    // fontFamily:"monospace"
  },
  number: {
    fontSize: 18,
    position: "absolute",
    top:110 ,
    left:30,
  },
  name: {
    fontSize: 16,
    position: "absolute",
    bottom: 30,
    left: 25,
    right: 100,
  },
  expiryLabel: {
    fontSize: 9,
    position: "absolute",
    bottom: 50,
    left: 218,
  },
  expiry: {
    fontSize: 16,
    position: "absolute",
    bottom: 30,
    left: 220,
  },
  amexCVC: {
    fontSize: 16,
    position: "absolute",
    top: 73,
    right: 30,
  },
  cvc: {
    fontSize: 16,
    position: "absolute",
    top: 80,
    right: 30,
  },
});

/* eslint react/prop-types: 0 */ // https://github.com/yannickcr/eslint-plugin-react/issues/106
export default class CardView extends Component {
  
  
  static propTypes = {
    focused: PropTypes.string,

    brand: PropTypes.string,
    name: PropTypes.string,
    number: PropTypes.string,
    expiry: PropTypes.string,
    cvc: PropTypes.string,
    placeholder: PropTypes.object,
    

    scale: PropTypes.number,
    fontFamily: PropTypes.string,
    imageFront: PropTypes.number,
    imageBack: PropTypes.number,
    customIcons: PropTypes.object,
  };
  
  static defaultProps = {
    name: "",
    placeholder: {
      cardtype:"CARD TYPE",
      number: "•••• •••• •••• ••••",
      name: "FULL NAME",
      expiry: "••/••",
      cvc: "•••",
    },

    scale: 1,
    fontFamily: Platform.select({ ios: "Courier", android: "monospace" }),
    imageFront: require("../images/card-front.png"),
    imageBack: require("../images/card-back.png"),
  };

  render() {
    const { focused,
      brand, name, number, expiry, cvc, customIcons,
      placeholder, imageFront, imageBack, scale, fontFamily,cardtype } = this.props;

    const Icons = { ...defaultIcons, ...customIcons };
    const isAmex = brand === "american-express";
    const shouldFlip = !isAmex && focused === "cvc";

    const containerSize = { ...BASE_SIZE, height: BASE_SIZE.height * scale };
    const transform = { transform: [
      { scale },
      { translateY: ((BASE_SIZE.height * (scale - 1) / 2)) },
    ] };

    return (
      <View style={[s.cardContainer, containerSize]}>
        <FlipCard style={{ borderWidth: 0 }}
          flipHorizontal
          flipVertical={false}
          friction={10}
          perspective={2000}
          clickable={false}
          flip={shouldFlip}>
          <ImageBackground style={[BASE_SIZE, s.cardFace, transform]}
            source={imageFront}>
              <Image style={[s.icon]}
                source={Icons[brand]} />
              <Text style={[s.baseText, { fontFamily }, s.cardtype, focused === "cardtype" && s.focused]}>
                { !cardtype ? placeholder.cardtype : cardtype }
              </Text>  
              <Text style={[s.baseText, { fontFamily }, s.number, !number && s.placeholder, focused === "number" && s.focused]}>
                { !number ? placeholder.number : number }
              </Text>
              <Text style={[s.baseText, { fontFamily }, s.name, !name && s.placeholder, focused === "name" && s.focused]}
                numberOfLines={1}>
                { !name ? placeholder.name : name }
              </Text>
              <Text style={[s.baseText, { fontFamily }, s.expiryLabel, s.placeholder, focused === "expiry" && s.focused]}>
                MONTH/YEAR
              </Text>
              <Text style={[s.baseText, { fontFamily }, s.expiry, !expiry && s.placeholder, focused === "expiry" && s.focused]}>
                { !expiry ? placeholder.expiry : expiry }
              </Text>
              { isAmex &&
                  <Text style={[s.baseText, { fontFamily }, s.amexCVC, !cvc && s.placeholder, focused === "cvc" && s.focused]}>
                    { !cvc ? placeholder.cvc : cvc }
                  </Text> }
          </ImageBackground>
          <ImageBackground style={[BASE_SIZE, s.cardFace, transform]}
            source={imageBack}>
              <Text style={[s.baseText, s.cvc, !cvc && s.placeholder, focused === "cvc" && s.focused]}>
                { !cvc ? placeholder.cvc : cvc }
              </Text>
          </ImageBackground>
        </FlipCard>
      </View>
    );
  }
}

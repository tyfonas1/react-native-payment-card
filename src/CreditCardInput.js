import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactNative, {
  NativeModules,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TextInput,
  ViewPropTypes,
  TouchableOpacity
} from "react-native";
const CVC_INPUT_WIDTH = (Dimensions.get("window").width - 30)/2.5;
const EXPIRY_INPUT_WIDTH = (Dimensions.get("window").width - 30)/2.5;
const CARD_NUMBER_INPUT_WIDTH_OFFSET = 40;
const CARD_NUMBER_INPUT_WIDTH = Dimensions.get("window").width - 30;
const NAME_INPUT_WIDTH = CARD_NUMBER_INPUT_WIDTH;
const PREVIOUS_FIELD_OFFSET = 40;
const POSTAL_CODE_INPUT_WIDTH = 120;
import CreditCard from "./CardView";
import CCInput from "./CCInput";
import { InjectedProps } from "./connectToState";

const s = StyleSheet.create({

  tabContainer:{
    display:'flex',
   flexDirection:'row',
   justifyContent:'space-between',
   margin:10,
   
   
  

  },

  tabStyle:{
    borderColor:"#058584",
    borderWidth:1,
    flex:1,
    padding:10,
    color:"black",
    
    borderRadius: 4,
    fontFamily: "Montserrat-Regular",
    display:"flex",
    alignItems:"center",
    justifyContent:"center",
    

  },
    

    
  
  tabStyleClicked:{
    borderColor:"#058584",
    borderWidth:1,
    flex:1,
    padding:10,
    backgroundColor: "#058584",
    borderRadius: 4,
    display:"flex",
    alignItems:"center",
    justifyContent:"center",
    // shadowColor: "#AEAEAE",
    // shadowOffset: {
    //   width: 0,
    //   height: 0
    // },
    // shadowOpacity: 0.29,
    // shadowRadius: 4,
    // elevation: 4
  

   
  },

  text:{
    fontFamily: "Montserrat-Regular",
    color:"black",
    fontSize:12,
    // fontWeight:"bold"
  },
  textClicked:{
    fontFamily: "Montserrat-Regular",
    color:"white",
    fontSize:12,
    // fontWeight:"bold"
  },
  
  container: {
    marginLeft:40,
    marginRight:40,
    // marginLeft:50,
    // marginRight:50
  },
  form: {
    marginTop: 20,

  },
  inputContainer: {
    // marginLeft: 50
    
  },
  inputLabel: {
    // marginTop:25,
    fontSize:16,
    color:'#058584'
  },
  input: {
    height: 40,
    backgroundColor:"#EFEFEF",
    borderRadius: 10
  },
  expCvv:{
   display:'flex',
   flexDirection:'row',
   justifyContent:'space-between',
  //  marginBottom:5 
  }
});



/* eslint react/prop-types: 0 */ // https://github.com/yannickcr/eslint-plugin-react/issues/106
export default class CreditCardInput extends Component {
  state={
    isDebitButtonChecked:false,
    isCreditButtonChecked:false
  };
  static propTypes = {
    ...InjectedProps,
    labels: PropTypes.object,
    placeholders: PropTypes.object,

    labelStyle: Text.propTypes.style,
    inputStyle: Text.propTypes.style,
    inputContainerStyle: ViewPropTypes.style,

    validColor: PropTypes.string,
    invalidColor: PropTypes.string,
    placeholderColor: PropTypes.string,

    cardImageFront: PropTypes.number,
    cardImageBack: PropTypes.number,
    cardScale: PropTypes.number,
    cardFontFamily: PropTypes.string,
    cardBrandIcons: PropTypes.object,

    allowScroll: PropTypes.bool,

    additionalInputsProps: PropTypes.objectOf(PropTypes.shape(TextInput.propTypes)),
  };

  static defaultProps = {
    cardViewSize: {},
    labels: {
      name: "Card Holder's Name",
      number: "Card Number",
      expiry: "Expiry date",
      cvc: "CVV",
      postalCode: "POSTAL CODE",
    },
    placeholders: {
      name: "Full Name",
      number: "1234 5678 1234 5678",
      expiry: "MM/YY",
      cvc: "CVC",
      postalCode: "34567",
    },
    inputContainerStyle: {
      // borderBottomWidth: 1,
      // borderBottomColor: "#058584",
      borderRadius:10
    },
    validColor: "",
    invalidColor: "red",
    placeholderColor: "gray",
    allowScroll: false,
    additionalInputsProps: {},
  };

  componentDidMount = () => this._focus(this.props.focused);

  componentWillReceiveProps = newProps => {
    if (this.props.focused !== newProps.focused) this._focus(newProps.focused);
  };

  _focus = field => {
    if (!field) return;

    const scrollResponder = this.refs.Form.getScrollResponder();
    const nodeHandle = ReactNative.findNodeHandle(this.refs[field]);

    NativeModules.UIManager.measureLayoutRelativeToParent(nodeHandle,
      e => { throw e; },
      x => {
        scrollResponder.scrollTo({ x: Math.max(x - PREVIOUS_FIELD_OFFSET, 0), animated: true });
        this.refs[field].focus();
      });
  }

  _inputProps = field => {
    const {
      inputStyle, labelStyle, validColor, invalidColor, placeholderColor,
      placeholders, labels, values, status,
      onFocus, onChange, onBecomeEmpty, onBecomeValid,
      additionalInputsProps,
    } = this.props;

    return {
      inputStyle: [s.input, inputStyle],
      labelStyle: [s.inputLabel, labelStyle],
      validColor, invalidColor, placeholderColor,
      ref: field, field,

      label: labels[field],
      placeholder: placeholders[field],
      value: values[field],
      status: status[field],

      onFocus, onChange, onBecomeEmpty, onBecomeValid,

      additionalInputProps: additionalInputsProps[field],
    };
  };

  render() {
    {this.state.isDebitButtonChecked?this.props.values.cardtype="DEBIT":this.props.values.cardtype="CREDIT"}
    const {
      cardImageFront, cardImageBack, inputContainerStyle,
      values: { number, expiry, cvc, name, type }, focused,
      allowScroll, requiresName, requiresCVC, requiresPostalCode,
      cardScale, cardFontFamily, cardBrandIcons
    } = this.props;

    return (
      <View style={s.container}>
        <View style={s.conntainer}>
        <CreditCard 
        cardtype={this.props.values.cardtype}
        focused={focused}
          brand={type}
          scale={cardScale}
          fontFamily={cardFontFamily}
          imageFront={cardImageFront}
          imageBack={cardImageBack}
          customIcons={cardBrandIcons}
          name={requiresName ? name : " "}
          number={number}
          expiry={expiry}
          cvc={cvc} />
          </View>
        <ScrollView ref="Form" 
          keyboardShouldPersistTaps="always"
          scrollEnabled={allowScroll}
          showsHorizontalScrollIndicator={false}
          style={s.form}>


            <View style={s.tabContainer}>
            {this.state.isDebitButtonChecked?
            <TouchableOpacity
             onPress={()=>{this.setState({
              isDebitButtonChecked:true,
              isCreditButtonChecked:false
            }) }}
            style={s.tabStyleClicked}>
              <Text style={s.textClicked}>Debit Card</Text></TouchableOpacity>:
              <TouchableOpacity 
              onPress={()=>{this.setState({
                isDebitButtonChecked:true,
                isCreditButtonChecked:false
              })}}
              style={s.tabStyle}>
              <Text style={s.text}>Debit Card</Text></TouchableOpacity>}

              {this.state.isCreditButtonChecked?
            <TouchableOpacity
             onPress={()=>{this.setState({
              isCreditButtonChecked:true,
              isDebitButtonChecked:false
            }) }}
            style={s.tabStyleClicked}>
              <Text style={s.textClicked}>Credit Card</Text></TouchableOpacity>:
              <TouchableOpacity 
              onPress={()=>{this.setState({
                isDebitButtonChecked:false,
                isCreditButtonChecked:true
              })}}
              style={s.tabStyle}>
              <Text style={s.text}>Credit Card</Text></TouchableOpacity>}
              
              
             


              {/* <TouchableOpacity style={s.tabStyle} onPress={()=>this.setState({
              isDebitButtonChecked:false,
              isCreditButtonChecked:true
            })}>
              {this.state.isCreditButtonChecked?<Text style={{backgroundColor:"#058584",color:"white"}}>Credit Card</Text>:<Text>Credit Card</Text>}
              
              </TouchableOpacity> */}
              </View>
              { requiresName &&
            <CCInput {...this._inputProps("name")}
              containerStyle={[s.inputContainer, inputContainerStyle, { width: NAME_INPUT_WIDTH }]} /> }
          <CCInput {...this._inputProps("number")}
            keyboardType="numeric"
            containerStyle={[s.inputContainer, inputContainerStyle, { width: CARD_NUMBER_INPUT_WIDTH }]} />
            
         
              <View style={s.expCvv}>
          <CCInput {...this._inputProps("expiry")}
            keyboardType="numeric"
            containerStyle={[s.inputContainer, inputContainerStyle, { width: EXPIRY_INPUT_WIDTH }]} />
          { requiresCVC &&
            <CCInput {...this._inputProps("cvc")}
              keyboardType="numeric"
              containerStyle={[s.inputContainer, inputContainerStyle, { width: CVC_INPUT_WIDTH }]} /> }</View>
          { requiresPostalCode &&
            <CCInput {...this._inputProps("postalCode")}
              keyboardType="numeric"
              containerStyle={[s.inputContainer, inputContainerStyle, { width: POSTAL_CODE_INPUT_WIDTH }]} /> }
        </ScrollView>
      </View>
    );
  }
}

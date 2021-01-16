import React, { Component } from 'react';
import { StyleSheet, View, FlatList,Text } from 'react-native';
import { ListItem, Icon } from 'react-native-elements';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader';
import SwipeableFlatList from '../components/SwipeableFlatList';
import db from '../config';

export default class NotificationScreen extends Component{
  constructor(props) {
        super(props);
    
        this.state = {
          userId :  firebase.auth().currentUser.email,
          allNotifications : []
        };
    
        this.notificationRef = null
      }


  
  getNotifications = ()=>{
    this.requestRef = db.collection("all_notifications").where("notifications_status", "==", "unread").where("targeted_user_id", "==", this.state.userId)
    .onSnapshot((snapshot)=>{
      var allNotifications = []
      snapshot.docs.map((doc)=>{
        var notification = doc.data()
        notification["doc_id"] = doc.doc_id
        allNotifications.push(notification)
      });
      this.setState({
        allNotifiactions : allNotifiactions
      })
    })
  }

  componentDidMount(){
    this.getNotifications()
  }

  componentWillUnmount(){
    this.notificationRef()
  }

  keyExtractor = (item, index) => index.toString()

  renderItem = ({item,index}) =>{
    return (
      <ListItem
        key={index}
        leftElement={<Icon name="book" type="font-awesome" color ='#696969'/>}
        title={item.book_name}
        titleStyle={styles.LiTitle}
        subtitle={item.message}
        bottomDivider
      />
    )
}
  
render(){
  return(
    <View style={styles.container}>
      <View style={{flex:0.1}}>
        <MyHeader title={"Notifications"} navigation={this.props.navigation}/>
      </View>
      <View style={{flex:0.9}}>
        {
          this.state.allNotifications.length === 0
          ?(
            <View style={styles.imageView}>
              <Image source = {require ("../assets/Notification.png")}/>
              <Text style={{fontSize:25}}>You have no notifications</Text>
            </View>
          )
          :(
            <SwipeableFlatList allNotifications = {this.state.allNotifications}/>
          )
        }
      </View>
    </View>
  )
}
}


const styles = StyleSheet.create({
container : {
  flex : 1
},
imageView : {
  flex : 1,
  justifyContent : "center",
  alignItems : "center"
},
LiTitle : {
  color : "black",
  fontWeight : "bold"
}
})

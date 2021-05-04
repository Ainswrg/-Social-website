import React from 'react';
import { connect } from 'react-redux';
import { onPostChange, updateNewPostText } from '../../../../Redux/profile-reducer';
import MyPost from './MyPost';


let mapStateToProps = (state) => {
   return {
      posts: state.profilePage.posts,
      newPostText: state.profilePage.newPostText,
   }
}
// let mapDispatchToProps = (dispatch) => {
//    return {
//       onPostChange: () => {
//          dispatch(addPostActionCreator());
//       },
//       updateNewPostText: (newPost) => {
//          let action = updateNewPostTextActionCreator(newPost)
//          dispatch(action);
//       }
//    }
// }

const MyPostContainer = connect(mapStateToProps, {
   onPostChange, updateNewPostText,
})(MyPost);

export default MyPostContainer;
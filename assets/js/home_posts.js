{
  //method to submit the from data for new post using AJAX
  let createPost = function () {
    let newPostForm = $("#new-post-form");

    newPostForm.submit(function (e) {
      e.preventDefault();
      $.ajax({
        type: "post",
        url: "/posts/create",
        data: newPostForm.serialize(),
       
        success: function (data) {
          new Noty({
            theme: "relax",
            text: "Post created successfully!",
            type: "success",
            layout: "topCenter",
            timeout: 1000,
            className: "custom-notification-class", // Add your custom class here
          }).show();
          let newPost = newPostDom(data.data.post);
          $("#posts-list-container>ul").prepend(newPost);
          deletePost($(" .delete-post-button", newPost));
        },
        error: function (error) {
          console.log("hi", error.responseText);
        },
      });
    });
  };

  //method to create a post in DOM
  let newPostDom = function (post) {
    return $(`
          <li id="post-${post._id}">
        <div class="post-content">
          
          <small
            ><a class="delete-post-button" href="/posts/destroy/${post._id}"
              >X</a
            ></small
          >
         
        </div>
        ${post.content}
        <div class="post-user">
        ${post.user.name} 
        </div>
        <div class="post-comments">
         
        <form action="/comments/create" id="new-comment-form" method="POST">
            <input
              type="text"
              name="content"
              placeholder="Type here to add comment..."
            />
            <input type="hidden" name="postId" value="${post._id}" />
            <input type="submit" value="Add comment" />
          </form>

          <div id="post-comments-list">
            <ul id="post-comments-${post._id}">
            
  
            </ul>
          </div>
        </div>
      </li>
`);
  };

  // method to delete a post from dom

  let deletePost = function (deleteLink) {
    $(deleteLink).click(function (e) {
      e.preventDefault();

      $.ajax({
        type: "get",
        url: $(deleteLink).prop("href"),
        success: function (data) {
          new Noty({
            theme: "relax",
            text: "Post deleted successfully!",
            type: "success",
            layout: "topCenter",
            timeout: 1000,
            className: "custom-notification-class", // Add your custom class here
          }).show();
          $(`#post-${data.data.post_id}`).remove();
        },
        error: function (error) {
          console.log(error.responseText);
        },
      });
    });
  };
  
  let createComment = function() {

    // find element with id dynamically from ejs input
  const postIdValue = $(`#postId`).val();
  const newCommentForm = $(`#new-comment-form-${postIdValue}`);
  for (let i = 0; i < newCommentForm.length; i++) {
 
    $(newCommentForm[i]).submit(function(e) {
      e.preventDefault();
      $.ajax({
          type: "post",
          url: newCommentForm.attr('action'),
          data: newCommentForm.serialize(),
          success: function(data) {
              let newComment = newCommentDom(data.data.comment);
              let postId = data.data.comment.post;
              let commentsContainer = $(`#post-comments-list #post-comments-${postId}`);
              commentsContainer.prepend(newComment);
          },
          error: function(error) {
              console.log("Error:", error.responseText);
          }
      });
  });
  }
};

  let newCommentDom = function (comment) {
    return $(`
    <li>
    <p>
      <small><a href="/comments/destroy/${comment._id}">X</a></small>
      ${comment.content}
      <br />
      <small>
      ${comment.user.name} 
      </small>
    </p>
  </li>
`);
  };

  createComment();
  createPost();
}

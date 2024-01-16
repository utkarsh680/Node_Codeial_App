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
          console.log(data);
          let newPost = newPostDom(data.data.post);
          $('#posts-list-container>ul').prepend(newPost);
        },
        error: function (error) {
          console.log("hi", error.responseText);
        },
      });
    });
  };

  //method to create a post in DOM
  let newPostDom = function(post) {
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
         
          <form action="/comments/create" method="POST">
            <input
              type="text"
              name="content"
              placeholder="Type here to add comment..."
            />
            <input type="hidden" name="postId" value="${post._id}" />
            <input type="hidden" name="userId" value="<%= locals.user._id %>" />
            <input type="submit" value="Add comment" />
          </form>
 

          <div class="post-comments-list">
            <ul id="post-comments-${post._id}">
              
            </ul>
          </div>
        </div>
      </li>
`)
  }
  createPost();
}

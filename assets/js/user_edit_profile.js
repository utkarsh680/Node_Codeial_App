let prevUsername = $("#name-input").val();
let previousAvatar = $("#user-avatar").attr("src");
let previousAddress = $("#address-input").val();

$("#edit-profile-form").submit(function (e) {
  e.preventDefault();

  const form = document.querySelector("#edit-profile-form");
  const formData = new FormData(form);

  if (
    prevUsername === formData.get("name") &&
    previousAddress === formData.get("address") &&
    formData.get("filepond").size === 0
  ) {
    new Noty({
      theme: "relax",
      text: "No changes made",
      type: "success",
      layout: "topRight",
      timeout: 1500,
    }).show();
    return;
  }

  const id = $("#local_user_id").val();
  const submitButton = $("#btnSubmit");

  // Disable submit button during the AJAX request
  submitButton.text("Updating...");
  submitButton.prop("disabled", true);
  submitButton.css({ cursor: "not-allowed" });
  $.ajax({
    type: "post",
    url: `/users/update/${id}`,
    data: formData,
    contentType: false,
    processData: false,
    success: function (data) {
      console.log(data);
      // Notification
      new Noty({
        theme: "relax",
        text: "Profile updated successfully",
        type: "success",
        layout: "topRight",
        timeout: 1500,
      }).show();

      // Update username
      $("#name-input").val(data.data.name);

      $("#address-input").val(data.data.address);

      // Update image
      $("#user-avatar").attr("src", data.data.avatar);

      // Remove the image preview of filepond
      pond.removeFiles();

      // Enable submit button after successful update
      submitButton.prop("disabled", false);
      submitButton.text("Update");
      submitButton.css({ cursor: "pointer" });
    },
    xhr: function () {
      const xhr = new window.XMLHttpRequest();
      let runOnce = true;

      xhr.upload.addEventListener(
        "progress",
        function (evt) {
          if (evt.lengthComputable) {
            const percentComplete = Math.round((evt.loaded / evt.total) * 100);
            if (percentComplete % 5 === 0) {
            }
          }
        },
        false
      );
      // Upload progress

      return xhr;
    },
    error: function (error) {
      console.log(error.responseText);
      //   // Enable submit button if there's an error
        submitButton
          .prop("disabled", false)
          .css("cursor", "pointer")
          .text("Update");
    },
  });
});

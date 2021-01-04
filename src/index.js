import "./styles.css";

const dz = document.querySelector(".dropzone");

const preventDefaults = (e) => {
  e.preventDefault();
  e.stopPropagation();
};

["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
  dz.addEventListener(eventName, preventDefaults, false);
  document.addEventListener(eventName, preventDefaults, false);
});

// Highlight drop area when item is dragged over it
["dragenter", "dragover"].forEach((eventName) => {
  dz.addEventListener(
    eventName,
    (e) => {
      e.target.classList.add("red");
      e.dataTransfer.dropEffect = "copy";
    },
    false
  );
});

["dragleave", "drop"].forEach((eventName) => {
  dz.addEventListener(
    eventName,
    (e) => {
      e.target.classList.remove("red");
      e.dataTransfer.effectAllowed = "none";
    },
    false
  );
});

const readFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (result) => {
      resolve({ name: file.name, image: reader.result });
      console.log(file);
    };
    reader.readAsDataURL(file);
  });
};

const uploadFile = (file) => {
  const url =
    "https://api.imgbb.com/1/upload?keya72861a301af178ad7a79fc76eae8ce3";

  let xhr = new XMLHttpRequest();

  let fd = new FormData();
  fd.append("image", file);
  xhr.open("POST", url, true);
  xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
  // Update progress (can be used to show progress indicator)
  /* xhr.upload.addEventListener("progress", function (e) {
      updateProgress(i, (e.loaded * 100.0) / e.total || 100);
    }); */
  xhr.addEventListener("readystatechange", function (e) {
    if (xhr.readyState === 4 && xhr.status === 200) {
      //updateProgress(i, 100); // <- Add this
      //console.log(xhr.responseText);
    } else if (xhr.readyState === 4 && xhr.status !== 200) {
      // Error. Inform the user
    }
  });

  xhr.open("POST", url, true);

  xhr.send(fd);
};
dz.addEventListener(
  "drop",
  async (e) => {
    e.preventDefault();
    e.stopPropagation();

    let images = await Promise.all(
      [...e.dataTransfer.files].map((f) => readFile(f))
    );
    //   [...e.dataTransfer.files].forEach((im) => fd.append("image", im, im.name));

    [...e.dataTransfer.files].forEach((im, i) => uploadFile(im));
  },
  false
);

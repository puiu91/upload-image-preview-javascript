import React, { Component } from "react";
import { render } from "react-dom";

/**
 * Returns a promise that reads a file as a dataUrl representation (composed
 * of a mimetype and a base64 string).
 *
 * @param file {File}
 * @return {Promise}
 */
async function readDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    // async event handlers
    reader.onload = e => resolve(reader.result);
    reader.onerror = e => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

class App extends Component {
  state = {
    file: null,
    base64: null,
    objectUrl: null
  };

  inputFileRef = null;

  // Simulate click of the file upload input.
  handleChangePhotoButton = e => {
    e.preventDefault();
    this.inputFileRef.click();
  };

  handleChangePhotoFileInput = e => {
    const target = e.currentTarget;
    const file = target.files.item(0);

    // validate file as image
    if (!file.type.startsWith("image/")) {
      alert("File is not an image");
      return;
    }

    // store reference to the File object and a base64 representation of it
    readDataUrl(file).then(dataUrl => {
      this.setState({
        ...this.state,
        file,
        base64: dataUrl,
        objectUrl: URL.createObjectURL(file)
      });
    });
  };

  render() {
    const { base64, objectUrl } = this.state;
    const defaultImage = "http://via.placeholder.com/300";

    return (
      <div className="grid-container">
        <div className="grid-x grid-padding-x grid-padding-y">
          <div className="cell">
            <h2>Upload Image Preview</h2>
            <p>
              See how to preview an uploaded image. Be sure to inspect the{" "}
              <code>src</code> tag of each image.
            </p>
            <input
              onChange={this.handleChangePhotoFileInput}
              ref={input => (this.inputFileRef = input)}
              style={{ display: "none" }}
              type="file"
            />
            <button onClick={this.handleChangePhotoButton} className="button">
              Upload Image
            </button>
          </div>
        </div>
        <div className="grid-x grid-padding-x grid-padding-y">
          <div className="cell small-6">
            <div className="callout">
              <h3>Base64</h3>
              <div className="card">
                <img
                  src={base64 || defaultImage}
                  ref={img => (this.imgRef = img)}
                />
              </div>
            </div>
          </div>

          <div className="cell small-6">
            <div className="callout">
              <h3>Object URL</h3>
              <div className="card">
                <img src={objectUrl || defaultImage} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));

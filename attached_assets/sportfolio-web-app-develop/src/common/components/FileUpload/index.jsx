import { Close } from 'assets/InputIcons';
import { useMemo, useEffect, useState } from 'react';
import {useDropzone} from 'react-dropzone'
import { colors } from 'utils/colors';

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '50px 30px 30px 30px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: colors.dark,
  outline: 'none',
  transition: 'border .24s ease-in-out',
  height: '150px'
};

const focusedStyle = {
  borderColor: '#2196f3'
};

const acceptStyle = {
  borderColor: '#00e676'
};

const rejectStyle = {
  borderColor: '#ff1744'
};

const thumbsContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16
};

const thumb = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: 'border-box',
  position: 'relative'
};

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden'
};

const img = {
  display: 'block',
  width: 'auto',
  height: '100%'
};

const close = {
  position: 'absolute',
  top: '-5px',
  right: '-5px',
  backgroundColor: 'rgba(255, 255, 255',
  borderRadius: '100%'
}

function StyledDropzone() {

  const [files, setFiles] = useState([]);

  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject
  } = useDropzone({
    accept: {
      'image/jpeg': [],
      'image/png': []
    },
    onDrop: acceptedFiles => {
      let accepted = acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      }))
      setFiles([...files, ...accepted]);
    }
});

  const style = useMemo(() => ({
    ...baseStyle,
    ...(isFocused ? focusedStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {})
  }), [
    isFocused,
    isDragAccept,
    isDragReject
  ]);

  const handleRemove = (index) =>{
    let newArray = files.filter((item, ind) => index !== ind)
    setFiles(newArray)
  }

  const thumbs = files.map((file, index) => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <img
          src={file.preview}
          style={img}
          // Revoke data uri after image is loaded
          onLoad={() => { URL.revokeObjectURL(file.preview) }}
        />

      </div>
      <Close color={colors.secondary} style={close} role='button' onClick={()=>handleRemove(index)} />
    </div>
  ));

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => files.forEach(file => URL.revokeObjectURL(file.preview));
  }, []);

  return (
    <>
    <div className="container">
      <div {...getRootProps({style})}>
        <input {...getInputProps()} />
        <p>Drag and drop some files here, or click to select files</p>
        <em>(Only *.jpeg and *.png images will be accepted)</em>
      </div>
    </div>
    <div style={thumbsContainer}>
        {thumbs}
      </div>
    </>
  );
}
export default StyledDropzone
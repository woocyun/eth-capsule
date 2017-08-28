import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';

const Loading = () => {
  return (
    <div>
      <div className="loading"></div>
      <CircularProgress
        style={{
          display: 'block',
          position: 'absolute',
          top: '45%',
          left: 0,
          width: '100%',
          textAlign: 'center'
        }}
      />
    </div>
  );
};

export default Loading;
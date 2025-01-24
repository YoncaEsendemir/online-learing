import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVideoByCoursId } from '../redux/slice/videoSlice';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';

function VideoPlayer() {
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const { videoList, status } = useSelector((state) => state.video);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    if (courseId) {
      dispatch(fetchVideoByCoursId(courseId));
    }
  }, [courseId, dispatch]);

  useEffect(() => {
    if (videoList.length > 0 && !selectedVideo) {
      setSelectedVideo(videoList[0]);
    }
  }, [videoList, selectedVideo]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  console.log('courseId:', courseId);
  console.log('videoList:', videoList);
  return (
    <Container fluid>
      <Row className="mt-4">
        {/* Video Player Section */}
        <Col md={9}>
          <Card className="mb-4">
            <Card.Body>
              {selectedVideo ? (
                <>
                  <video 
                    className="w-100" 
                    style={{ aspectRatio: '16/9' }}
                    controls
                    key={selectedVideo.url}
                  >
                    <source  src={`http://localhost:8080${selectedVideo.url}`} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <h3 className="mt-3">{selectedVideo.title}</h3>
                </>
              ) : (
                <div 
                  className="d-flex align-items-center justify-content-center"
                  style={{ aspectRatio: '16/9', backgroundColor: '#f8f9fa' }}
                >
                  <p className="text-muted">Lütfen izlemek için bir video seçin</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Video List Section */}
        <Col md={3}>
          <Card>
            <Card.Header>
              <h4 className="mb-0">Video Listesi</h4>
            </Card.Header>
            <Card.Body>
              <div className="video-list" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                {videoList && videoList.map((video) => (
                  <div
                    key={video.id}
                    className={`p-2 cursor-pointer ${
                      selectedVideo?.id === video.id ? 'bg-primary text-white' : 'hover:bg-light'
                    }`}
                    onClick={() => setSelectedVideo(video)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="d-flex align-items-center">
                      <div className="ms-2">
                        <h6 className="mb-0">{video.title}</h6>
                        {video.duration && (
                          <small className="text-muted">{video.duration}</small>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default VideoPlayer;


import React, { useEffect, useState } from 'react';
import { fetchVideoByCoursId } from '../redux/slice/videoSlice';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col } from 'react-bootstrap';

function CoursVideos() {
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const { videoList, status: videoStatus, error: videoError } = useSelector((state) => state.video);

  // Seçili video URL'sini tutmak için bir state
  const [selectedVideo, setSelectedVideo] = useState(null);

  // courseId'ye göre videoları fetch etmek
  useEffect(() => {
    if (courseId) {
      dispatch(fetchVideoByCoursId(courseId));
    }
  }, [courseId, dispatch]);

  // Videonun yüklenme durumu
  if (videoStatus === 'loading') return <p>Videolar yükleniyor...</p>;
  if (videoError) return <p>Hata: {videoError}</p>;

  return (
    <Container>
      <Row className="mt-5">
        {/* Video Oynatıcı */}
        <Col md={9}>
          <h1>Video Oynatıcı</h1>
          {selectedVideo ? (
            <video width="640" height="360" controls>
              <source src={selectedVideo} type="video/mp4" />
              Tarayıcınız video oynatmayı desteklemiyor.
            </video>
          ) : (
            <p>Lütfen bir video seçin.</p>
          )}
        </Col>

        {/* Video Listesi */}
        <Col md={3}>
          <h2 className="mb-4">Videolar</h2>
          <ul className="category-list">
            {videoList &&
              videoList.map((video) => (
                <li key={video.id}>
                  {/* Tıklama ile seçili videoyu değiştir */}
                  <Link
                    to="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedVideo(video.url); // Videonun URL'sini state'e ata
                    }}
                  >
                    {video.name}
                  </Link>
                </li>
              ))}
          </ul>
        </Col>
      </Row>
    </Container>
  );
}

export default CoursVideos;

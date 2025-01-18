import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers, deleteUser } from '../redux/slice/userSlice';
import { FaTrash } from 'react-icons/fa';
import { Table, Container, Button, Form, InputGroup, Modal } from 'react-bootstrap';
import { Search } from 'react-bootstrap-icons';
import '../css/userList.css';
import Loader from '../components/Loading';

const UserList = () => {
  const dispatch = useDispatch();
  const { users = [], status, error } = useSelector((state) => state.user); // Boş bir dizi varsayılan olarak eklendi
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    console.log('Status:', status); // Status'ü logla
    if(status=="idle"){
      dispatch(fetchUsers());
    }
  }, [dispatch,status]); // Sadece dispatch bağımlılık olarak bırakıldı

  // Kullanıcıları filtrele
  const filteredUsers = users.filter(user =>
    Object.values(user).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (status === 'loading') {
    return <Loader message="Kullanıcılar yükleniyor..." />;
  }

  if (status === 'failed') {
    return <div className="error">Hata: {error}</div>;
  }

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (userToDelete) {
      try {
        await dispatch(deleteUser(userToDelete.id)).unwrap(); // unwrap hata fırlatırsa yakalayabiliriz
        dispatch(fetchUsers()); // Kullanıcı listesini yeniden yükle
      } catch (err) {
        console.error('Silme işlemi başarısız oldu:', err);
      } finally {
        setShowDeleteModal(false);
      }
    }
  };

  return (
    <Container fluid className="user-list-container">
      <h1 className="text-center mb-4">Kullanıcı Listesi</h1>
      <InputGroup className="mb-3">
        <InputGroup.Text>
          <Search />
        </InputGroup.Text>
        <Form.Control
          placeholder="Kullanıcı ara..."
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </InputGroup>
      <Table striped bordered hover responsive className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Ad</th>
            <th>Soyad</th>
            <th>E-posta</th>
            <th>Biografi</th>
            <th>Kayıt Tarihi</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user, index) => {
            if (user.role === 0) {
              return (
                <tr key={user.id} style={{ animationDelay: `${index * 0.1}s` }}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.lastName}</td>
                  <td>{user.email}</td>
                  <td>{user.bio}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString('tr-TR')}</td>
                  <td>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDeleteClick(user)}>
                      <FaTrash /> Sil
                    </Button>
                  </td>
                </tr>
              );
            }
            return null;
          })}
        </tbody>
      </Table>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Kullanıcı Silme Onayı</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {userToDelete ? `${userToDelete.name} kullanıcısını silmek istediğinizden emin misiniz?` : null}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            İptal
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Sil
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UserList;

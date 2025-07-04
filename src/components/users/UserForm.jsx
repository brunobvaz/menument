import React, { useEffect, useRef, useState } from 'react';

const defaultUser = {
  name: '',
  email: '',
  perfil: 'user',
  status: 'inactive',
  photo: null,
};

const UserForm = ({ user = null, onSave, onCancel }) => {
  const [form, setForm] = useState(defaultUser);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef();

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        perfil: user.perfil || 'user',
        status: user.status || 'inactive',
        photo: null,
      });
      setPreview(user.photo ? `https://menumentapp.com/uploads/${user.photo}` : null);
    } else {
      setForm(defaultUser);
      setPreview(null);
    }
  }, [user]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, photo: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setForm((prev) => ({ ...prev, photo: null }));
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="card shadow p-4">
      <h5 className="mb-4">{user ? 'Editar Utilizador' : 'Novo Utilizador'}</h5>
      <form onSubmit={handleSubmit}>
        <div className="row">
          {/* Coluna Principal (2/3) */}
          <div className="col-md-8">
            <div className="mb-3">
              <label className="form-label">Nome</label>
              <input
                type="text"
                className="form-control"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Perfil</label>
              <select
                className="form-select"
                value={form.perfil}
                onChange={(e) => handleChange('perfil', e.target.value)}
              >
                <option value="user">Utilizador</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={form.status}
                onChange={(e) => handleChange('status', e.target.value)}
              >
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
              </select>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-4">
              {onCancel && (
                <button type="button" className="btn btn-secondary" onClick={onCancel}>
                  Cancelar
                </button>
              )}
              <button type="submit" className="btn btn-primary">
                Salvar
              </button>
            </div>
          </div>

          {/* Coluna Foto (1/3) */}
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label">Foto de Perfil</label>
              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Selecionar Foto
                </button>
                {preview && (
                  <button type="button" className="btn btn-outline-danger" onClick={handleRemoveImage}>
                    Remover
                  </button>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleImageChange}
              />
            </div>

            <div
              className="d-flex justify-content-center align-items-center"
              style={{
                width: '100%',
                height: '200px',
                border: '2px dashed #ccc',
                borderRadius: '8px',
                backgroundColor: '#f8f9fa',
                overflow: 'hidden',
              }}
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                />
              ) : (
                <span className="text-muted">Pré-visualização da imagem</span>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UserForm;

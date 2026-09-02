import pytest

TEST_EMAIL = 'testuser@example.com'
TEST_PASSWORD = 'securepass123'


@pytest.mark.asyncio
async def test_register_success(client):
    """Test successful user registration."""
    response = await client.post('/auth/register', json={
        'email': TEST_EMAIL,
        'password': TEST_PASSWORD,
    })
    assert response.status_code == 201
    data = response.json()
    assert data['email'] == TEST_EMAIL
    assert data['role'] == 'user'
    assert 'id' in data
    assert 'created_at' in data


@pytest.mark.asyncio
async def test_register_duplicate_email(client):
    """Test that duplicate email registration returns 409."""
    # First registration
    await client.post('/auth/register', json={
        'email': 'duplicate@example.com',
        'password': TEST_PASSWORD,
    })
    # Second registration with same email
    response = await client.post('/auth/register', json={
        'email': 'duplicate@example.com',
        'password': TEST_PASSWORD,
    })
    assert response.status_code == 409


@pytest.mark.asyncio
async def test_register_invalid_email(client):
    """Test that invalid email format returns 422."""
    response = await client.post('/auth/register', json={
        'email': 'not-an-email',
        'password': TEST_PASSWORD,
    })
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_register_short_password(client):
    """Test that short password returns 422."""
    response = await client.post('/auth/register', json={
        'email': 'short@example.com',
        'password': '12345',  # Less than 6 chars
    })
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_login_success(client):
    """Test successful login returns a JWT token."""
    # Register first
    await client.post('/auth/register', json={
        'email': 'logintest@example.com',
        'password': TEST_PASSWORD,
    })
    # Login
    response = await client.post('/auth/login', json={
        'email': 'logintest@example.com',
        'password': TEST_PASSWORD,
    })
    assert response.status_code == 200
    data = response.json()
    assert 'access_token' in data
    assert data['token_type'] == 'bearer'
    assert len(data['access_token']) > 0


@pytest.mark.asyncio
async def test_login_wrong_password(client):
    """Test that wrong password returns 401."""
    await client.post('/auth/register', json={
        'email': 'wrongpass@example.com',
        'password': TEST_PASSWORD,
    })
    response = await client.post('/auth/login', json={
        'email': 'wrongpass@example.com',
        'password': 'wrongpassword',
    })
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_login_nonexistent_user(client):
    """Test that login with nonexistent email returns 401."""
    response = await client.post('/auth/login', json={
        'email': 'doesnotexist@example.com',
        'password': TEST_PASSWORD,
    })
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_get_me_authenticated(client):
    """Test that /auth/me returns current user profile with valid token."""
    # Register
    await client.post('/auth/register', json={
        'email': 'metest@example.com',
        'password': TEST_PASSWORD,
    })
    # Login
    login_resp = await client.post('/auth/login', json={
        'email': 'metest@example.com',
        'password': TEST_PASSWORD,
    })
    token = login_resp.json()['access_token']

    # Get profile
    response = await client.get('/auth/me', headers={
        'Authorization': f'Bearer {token}',
    })
    assert response.status_code == 200
    data = response.json()
    assert data['email'] == 'metest@example.com'
    assert data['role'] == 'user'


@pytest.mark.asyncio
async def test_get_me_no_token(client):
    """Test that /auth/me returns 403 without a token."""
    response = await client.get('/auth/me')
    assert response.status_code == 403


@pytest.mark.asyncio
async def test_get_me_invalid_token(client):
    """Test that /auth/me returns 401 with an invalid token."""
    response = await client.get('/auth/me', headers={
        'Authorization': 'Bearer invalid.token.here',
    })
    assert response.status_code == 401

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
    """Test that /auth/me returns 401 or 403 without a token."""
    response = await client.get('/auth/me')
    assert response.status_code in (401, 403)


@pytest.mark.asyncio
async def test_get_me_invalid_token(client):
    """Test that /auth/me returns 401 with an invalid token."""
    response = await client.get('/auth/me', headers={
        'Authorization': 'Bearer invalid.token.here',
    })
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_verify_recruiter_key_valid(client):
    """Test elevating to recruiter with valid access key."""
    # Register and login
    await client.post('/auth/register', json={
        'email': 'recruitertest@example.com',
        'password': TEST_PASSWORD,
    })
    login_resp = await client.post('/auth/login', json={
        'email': 'recruitertest@example.com',
        'password': TEST_PASSWORD,
    })
    token = login_resp.json()['access_token']

    # Verify key
    resp = await client.post(
        '/auth/verify-recruiter',
        json={'access_key': 'RECRUITER2026'},
        headers={'Authorization': f'Bearer {token}'},
    )
    assert resp.status_code == 200
    assert resp.json()['role'] == 'recruiter'

    # Check /auth/me reflects recruiter role
    me_resp = await client.get('/auth/me', headers={'Authorization': f'Bearer {token}'})
    assert me_resp.json()['role'] == 'recruiter'


@pytest.mark.asyncio
async def test_verify_recruiter_key_invalid(client):
    """Test rejecting invalid recruiter key."""
    await client.post('/auth/register', json={
        'email': 'invalidkey@example.com',
        'password': TEST_PASSWORD,
    })
    login_resp = await client.post('/auth/login', json={
        'email': 'invalidkey@example.com',
        'password': TEST_PASSWORD,
    })
    token = login_resp.json()['access_token']

    resp = await client.post(
        '/auth/verify-recruiter',
        json={'access_key': 'WRONG-KEY-XYZ'},
        headers={'Authorization': f'Bearer {token}'},
    )
    assert resp.status_code == 403


@pytest.mark.asyncio
async def test_elevate_demo_recruiter(client):
    """Test 1-click evaluator recruiter elevation."""
    await client.post('/auth/register', json={
        'email': 'elevatetest@example.com',
        'password': TEST_PASSWORD,
    })
    login_resp = await client.post('/auth/login', json={
        'email': 'elevatetest@example.com',
        'password': TEST_PASSWORD,
    })
    token = login_resp.json()['access_token']

    resp = await client.post(
        '/auth/elevate-demo-recruiter',
        headers={'Authorization': f'Bearer {token}'},
    )
    assert resp.status_code == 200
    assert resp.json()['role'] == 'recruiter'


@pytest.mark.asyncio
async def test_login_with_portal_isolation(client):
    """Test that logging in via candidate portal returns role 'user' and recruiter returns 'recruiter'."""
    email = 'portalswitch@example.com'
    await client.post('/auth/register', json={
        'email': email,
        'password': TEST_PASSWORD,
    })

    # 1. Log in via recruiter portal
    recruiter_resp = await client.post('/auth/login', json={
        'email': email,
        'password': TEST_PASSWORD,
        'portal': 'recruiter',
    })
    assert recruiter_resp.status_code == 200
    assert recruiter_resp.json()['role'] == 'recruiter'

    # 2. Log in via student portal with the same account
    candidate_resp = await client.post('/auth/login', json={
        'email': email,
        'password': TEST_PASSWORD,
        'portal': 'candidate',
    })
    assert candidate_resp.status_code == 200
    assert candidate_resp.json()['role'] == 'user'


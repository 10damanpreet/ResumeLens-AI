import pytest


@pytest.mark.asyncio
async def test_health_check(client):
    """Test that the health endpoint returns OK status."""
    response = await client.get('/health')
    assert response.status_code == 200
    data = response.json()
    assert data['status'] == 'ok'
    assert 'version' in data
    assert data['database'] == 'connected'

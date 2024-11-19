const clientId = 'Iv23liuJXVFT3RDWF4dY';
const redirectUri = 'https://kane-thornwyrd.github.io/consequences';

let token = null;
let octokit = null;

document.getElementById('login-btn').addEventListener('click', () => {
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=repo&redirect_uri=${redirectUri}`;
  window.location.href = authUrl;
});

// Step 1: Handle GitHub OAuth Redirect
if (window.location.search.includes('code=')) {
  const code = new URLSearchParams(window.location.search).get('code');
  // Exchange the code for a token using GitHub API (client-side flow with PKCE is ideal)
  fetch(`https://github.com/login/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: clientId,
      redirect_uri: redirectUri,
      code: code,
    }),
  })
    .then((response) => response.text())
    .then((params) => {
      token = new URLSearchParams(params).get('access_token');
      localStorage.setItem('github_token', token);
      octokit = new Octokit({ auth: token });
      document.getElementById('login-btn').style.display = 'none';
      document.getElementById('content').style.display = 'block';
    });
}

// Step 2: List Files in a Repository
document.getElementById('list-files-btn').addEventListener('click', async () => {
  const repo = document.getElementById('repo-input').value;
  const [owner, repoName] = repo.split('/');

  try {
    const { data } = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
      owner,
      repo: repoName,
      path: '',
    });

    const fileList = document.getElementById('file-list');
    fileList.innerHTML = '';
    data.forEach((file) => {
      const li = document.createElement('li');
      li.textContent = `${file.name} (${file.type})`;
      fileList.appendChild(li);
    });

    document.getElementById('fork-btn').style.display = 'block';
  } catch (error) {
    console.error(error);
  }
});

// Step 3: Fork Repository
document.getElementById('fork-btn').addEventListener('click', async () => {
  const repo = document.getElementById('repo-input').value;
  const [owner, repoName] = repo.split('/');

  try {
    await octokit.request('POST /repos/{owner}/{repo}/forks', {
      owner,
      repo: repoName,
    });

    alert('Repository forked successfully!');
    document.getElementById('edit-btn').style.display = 'block';
  } catch (error) {
    console.error(error);
  }
});

// Step 4: Clone Repository and Edit/Create Files
document.getElementById('edit-btn').addEventListener('click', async () => {
  alert('Edit/Create functionality can be simulated here.');
  document.getElementById('pr-btn').style.display = 'block';
});

// Step 5: Submit Pull Request
document.getElementById('pr-btn').addEventListener('click', async () => {
  const repo = document.getElementById('repo-input').value;
  const [owner, repoName] = repo.split('/');
  const forkOwner = 'YOUR_GITHUB_USERNAME';

  try {
    await octokit.request('POST /repos/{owner}/{repo}/pulls', {
      owner,
      repo: repoName,
      title: 'Pull Request Title',
      body: 'Pull Request Description',
      head: `${forkOwner}:branch-name`,
      base: 'main',
    });

    alert('Pull request submitted successfully!');
  } catch (error) {
    console.error(error);
  }
});

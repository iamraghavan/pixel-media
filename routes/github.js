
import express from 'express';
import { Octokit } from '@octokit/rest';

const router = express.Router();

const checkAuthAndInitOctokit = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  req.octokit = new Octokit({ auth: req.user.accessToken });
  next();
};

router.use(checkAuthAndInitOctokit);

router.get('/repos/:owner/:repo/contents/:path(*)', async (req, res) => {
  const { owner, repo } = req.params;
  const path = req.params.path || '';

  try {
    const { data } = await req.octokit.repos.getContent({
      owner,
      repo,
      path,
    });
    res.json(data);
  } catch (error) {
    console.error('Error fetching repo contents:', error);
    res.status(500).json({ error: 'Failed to fetch repository contents.' });
  }
});

router.post('/repos/:owner/:repo/contents/:path(*)', async (req, res) => {
  const { owner, repo } = req.params;
  const path = req.params.path;
  const { message, content, sha } = req.body;

  if (!path) {
    return res.status(400).json({ error: 'File path is required.' });
  }
  if (!message || !content) {
    return res.status(400).json({ error: 'Commit message and base64 content are required.' });
  }

  try {
    const { data } = await req.octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message,
      content,
      sha, 
    });
    res.status(sha ? 200 : 201).json(data);
  } catch (error) {
    console.error('Error creating/updating file:', error);
    res.status(500).json({ error: 'Failed to create or update file.' });
  }
});

router.delete('/repos/:owner/:repo/contents/:path(*)', async (req, res) => {
  const { owner, repo } = req.params;
  const path = req.params.path;
  const { message, sha } = req.body;

  if (!path) {
    return res.status(400).json({ error: 'File path is required.' });
  }
  if (!message || !sha) {
    return res.status(400).json({ error: 'Commit message and file SHA are required.' });
  }

  try {
    const { data } = await req.octokit.repos.deleteFile({
      owner,
      repo,
      path,
      message,
      sha,
    });
    res.json(data);
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ error: 'Failed to delete file.' });
  }
});

export default router;

import express, { Request, Response } from 'express';
import { SearchRequest, SearchResponse, ErrorResponse } from '../types';
import { searchService } from './searchService';

const router = express.Router();

/**
 * @swagger
 * /api/search:
 *   post:
 *     summary: Search for words in fairy tales
 *     tags: [Search]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - query
 *             properties:
 *               query:
 *                 type: string
 *                 description: The word or phrase to search for
 *                 example: "princess"
 *               limit:
 *                 type: integer
 *                 description: Maximum number of results to return
 *                 default: 10
 *                 minimum: 1
 *                 maximum: 50
 *               caseSensitive:
 *                 type: boolean
 *                 description: Whether the search should be case sensitive
 *                 default: false
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       tale:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           title:
 *                             type: string
 *                           url:
 *                             type: string
 *                           content:
 *                             type: string
 *                       matches:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             line:
 *                               type: string
 *                             lineNumber:
 *                               type: integer
 *                             context:
 *                               type: string
 *                       relevanceScore:
 *                         type: number
 *                 totalResults:
 *                   type: integer
 *                 query:
 *                   type: string
 *                 searchTime:
 *                   type: integer
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal server error
 */
router.post('/', async (req: Request<{}, SearchResponse | ErrorResponse, SearchRequest>, res: Response<SearchResponse | ErrorResponse>) => {
  try {
    const { query, limit, caseSensitive } = req.body;

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return res.status(400).json({ error: 'Query is required and must be a non-empty string' });
    }

    if (limit && (limit < 1 || limit > 50)) {
      return res.status(400).json({ error: 'Limit must be between 1 and 50' });
    }

    const searchRequest: SearchRequest = {
      query: query.trim(),
      limit: limit || 10,
      caseSensitive: caseSensitive || false
    };

    const results = await searchService.search(searchRequest);
    res.json(results);
  } catch (error: any) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Internal server error during search' });
  }
});

/**
 * @swagger
 * /api/search/tales:
 *   get:
 *     summary: Get list of available fairy tales
 *     tags: [Search]
 *     responses:
 *       200:
 *         description: List of available fairy tales
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tales:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       url:
 *                         type: string
 *       500:
 *         description: Internal server error
 */
router.get('/tales', async (req: Request, res: Response) => {
  try {
    const tales = await searchService.getTales();
    res.json({ tales });
  } catch (error: any) {
    console.error('Error fetching tales:', error);
    res.status(500).json({ error: 'Failed to fetch fairy tales list' });
  }
});

/**
 * @swagger
 * /api/search/tales/{id}:
 *   get:
 *     summary: Get a specific fairy tale by ID
 *     tags: [Search]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The fairy tale ID
 *     responses:
 *       200:
 *         description: Fairy tale content
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tale:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     title:
 *                       type: string
 *                     url:
 *                       type: string
 *                     content:
 *                       type: string
 *       404:
 *         description: Fairy tale not found
 *       500:
 *         description: Internal server error
 */
router.get('/tales/:id', async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;
    const tale = await searchService.getTaleById(id);

    if (!tale) {
      return res.status(404).json({ error: 'Fairy tale not found' });
    }

    res.json({ tale });
  } catch (error: any) {
    console.error('Error fetching tale:', error);
    res.status(500).json({ error: 'Failed to fetch fairy tale' });
  }
});

/**
 * @swagger
 * /api/search/stats:
 *   get:
 *     summary: Get search service statistics
 *     tags: [Search]
 *     responses:
 *       200:
 *         description: Search service statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalTales:
 *                   type: integer
 *                 isInitialized:
 *                   type: boolean
 *                 baseUrl:
 *                   type: string
 */
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const tales = await searchService.getTales();
    res.json({
      totalTales: tales.length,
      isInitialized: true,
      baseUrl: 'https://www.cs.cmu.edu/~spok/grimmtmp'
    });
  } catch (error: any) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

export default router;

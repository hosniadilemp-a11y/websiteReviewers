document.addEventListener('DOMContentLoaded', () => {
    // Legacy sidebar references removed
    const contentContainer = document.getElementById('content-container');
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    // Render Dashboard initially

    // Merge Tags from Extenal File
    if (typeof commentTags !== 'undefined' && typeof responseData !== 'undefined') {
        responseData.forEach(reviewerBlock => {
            if (reviewerBlock.comments) {
                reviewerBlock.comments.forEach(comment => {
                    // Create key: "Reviewer Name: Title"
                    // Check if title includes reviewer name already
                    // Our parser extracts title like "Reviewer 4, Comment 4.1"
                    // So key is just title? 
                    // Let's match the generator logic: key = f"{reviewer}: {comment['title']}"
                    // Reviewer block has 'reviewer' field e.g. "Reviewer 4"

                    const key = `${reviewerBlock.reviewer}: ${comment.title}`;
                    if (commentTags[key]) {
                        comment.tags = commentTags[key];
                    }
                });
            }
        });
    }

    renderDashboard(responseData);

    // Function to calculate detailed stats for a reviewer
    function getReviewerStats(reviewerData) {
        let comments = 0;
        let revisions = 0;
        let experiments = 0;
        let newContent = 0;
        let methodology = 0;
        let comparison = 0;

        reviewerData.comments.forEach(c => {
            if (!c.is_intro) comments++;
            // Check tags from both item and global map if needed - but here item.tags is populated
            if (c.tags) {
                if (c.tags.includes('Revision')) revisions++;
                if (c.tags.includes('Experiment')) experiments++;
                if (c.tags.includes('New Content')) newContent++;
                if (c.tags.includes('Methodology')) methodology++;
                if (c.tags.includes('Comparison')) comparison++;
            }
        });

        return { comments, revisions, experiments, newContent, methodology, comparison };
    }

    function renderDashboard(data) {
        contentContainer.innerHTML = '';

        const dashboard = document.createElement('div');
        dashboard.className = 'dashboard';

        const header = document.createElement('div');
        header.className = 'dashboard-header';
        header.innerHTML = `
            <h1>Outline of Responses</h1>
            <button class="nav-btn realistic-btn" onclick="window.location.href='index2.html'" style="margin: 1rem auto; display: flex; width: fit-content; font-size: 1.1rem; padding: 0.8rem 1.5rem;">
                ✅ Open Paper Final Polish Checklist
            </button>
        `;

        // Add Legend
        const legend = document.createElement('div');
        legend.className = 'dashboard-legend';
        legend.innerHTML = `
            <div class="legend-item" data-tag="Experiment">
                <span class="stat-badge-full" style="color:#1e40af; background:#dbeafe;">🧪 Experiments</span>
                <span class="legend-desc">New experiments have been added</span>
            </div>
            <div class="legend-item" data-tag="Revision">
                <span class="stat-badge-full" style="color:#9d174d; background:#fce7f3;">📄 Revisions</span>
                <span class="legend-desc">Parts of the paper have been revised and corrected</span>
            </div>
            <div class="legend-item" data-tag="New Content">
                <span class="stat-badge-full" style="color:#166534; background:#dcfce7;">➕ New Content</span>
                <span class="legend-desc">New sections have been added</span>
            </div>
            <div class="legend-item" data-tag="Methodology">
                <span class="stat-badge-full" style="color:#5b21b6; background:#f5f3ff;">🧠 Methodology</span>
                <span class="legend-desc">Theoretical analysis and methodology enhancements have been conducted</span>
            </div>
            <div class="legend-item" data-tag="Comparison">
                <span class="stat-badge-full" style="color:#c2410c; background:#fff7ed;">⚖️ Comparison</span>
                <span class="legend-desc">New Baseline and SOTA comparisons have been added</span>
            </div>
        `;
        header.appendChild(legend);

        dashboard.appendChild(header);

        // Defined Outline Data
        const tocStructure = [
            {
                title: "Response to Editor",
                index: 0,
                items: [
                    { label: "Response to Editor", commentId: 0 }
                ]
            },
            {
                title: "Response to Reviewer 1",
                index: 1,
                items: [
                    { label: "1. Novelty distinction from prior methods", commentId: 0 },
                    { label: "2. NMF-based methods and comparison", commentId: 1 },
                    { label: "3. Hyperparameters and large-scale experiments", commentId: 2 },
                    { label: "4. Training/inference time comparisons", commentId: 3 },
                    { label: "5. Negative sampling strategies", commentId: 4 },
                    { label: "6. Writing style improvements", commentId: 5 },
                    { label: "7. Abstract reorganization", commentId: 6 },
                    { label: "8. Attribute handling validation", commentId: 7 }
                ]
            },
            {
                title: "Response to Reviewer 2",
                index: 2,
                items: [
                    { label: "1. Theoretical guarantees added", commentId: 0 },
                    { label: "2. Expanded experiments and table consolidation", commentId: 1 },
                    { label: "3. Writing style and structural improvements", commentId: 2 },
                    { label: "4. Citations from target journal", commentId: 3 },
                    { label: "5. Code availability commitment", commentId: 4 }
                ]
            },
            {
                title: "Response to Reviewer 3",
                index: 3,
                items: [
                    { label: "1. Novelty clarification as HPC-aware framework", commentId: 0 },
                    { label: "2. Class imbalance handling clarification", commentId: 1 },
                    { label: "3. Extended ablation studies", commentId: 2 },
                    { label: "4. Large-scale synthetic experiments", commentId: 3 },
                    { label: "5. Baseline definitions clarified", commentId: 4 },
                    { label: "6. Edge attribute incorporation", commentId: 5 },
                    { label: "7. Minor errors and formatting corrections", commentId: 6 }
                ]
            },
            {
                title: "Response to Reviewer 4",
                index: 4,
                items: [
                    { label: "1. Negative sampling strategy specification", commentId: 0 },
                    { label: "2. Edge-network construction clarification", commentId: 1 },
                    { label: "3. Classical conversion methods comparison", commentId: 2 },
                    { label: "4. Abstract inconsistency", commentId: 3 },
                    { label: "5. Missing figure numbering", commentId: 4 },
                    { label: "6. Incorrect internal reference", commentId: 5 },
                    { label: "7. Reference formatting", commentId: 6 },
                    { label: "8. Logical inconsistency with Tables", commentId: 7 },
                    { label: "9. Conclusion section issues", commentId: 8 },
                    { label: "10. Outdated references", commentId: 9 }
                ]
            },
            {
                title: "Response to Reviewer 5",
                index: 5,
                items: [
                    { label: "1. References updated", commentId: 0 },
                    { label: "2. Recent heuristic methods included", commentId: 1 },
                    { label: "3. Standard benchmark datasets added", commentId: 2 },
                    { label: "4. Baseline methods introduction", commentId: 3 },
                    { label: "5. Repeated experiments specification", commentId: 4 },
                    { label: "6. Method selection justification", commentId: 5 },
                    { label: "7. Statistical methods subsection added", commentId: 6 },
                    { label: "8. Network types specification", commentId: 7 },
                    { label: "9. Node labels and features explained", commentId: 8 },
                    { label: "10. Figure-text correspondence", commentId: 9 },
                    { label: "11. Algorithm 1 revised", commentId: 10 },
                    { label: "12. Notation clarified", commentId: 11 },
                    { label: "13. Formatting issues fixed", commentId: 12 },
                    { label: "14. AI writing style revised", commentId: 13 },
                    { label: "15. Open-source code", commentId: 14 }
                ]
            }
        ];

        const tocContainer = document.createElement('div');
        tocContainer.className = 'toc-container';

        tocStructure.forEach(section => {
            const sectionDiv = document.createElement('div');
            sectionDiv.className = 'toc-section';

            // Get stats for this reviewer
            const stats = getReviewerStats(data[section.index]);

            const sectionTitle = document.createElement('div');
            sectionTitle.className = 'toc-section-title';

            // Build title with stats
            let statsHtml = `<span class="toc-stats">`;
            statsHtml += `<span class="stat-badge-full">💬 ${stats.comments} Comments</span>`;
            if (stats.experiments > 0) statsHtml += `<span class="stat-badge-full" style="color:#1e40af; background:#dbeafe;">🧪 ${stats.experiments} Experiments</span>`;
            if (stats.revisions > 0) statsHtml += `<span class="stat-badge-full" style="color:#9d174d; background:#fce7f3;">📄 ${stats.revisions} Revisions</span>`;
            if (stats.newContent > 0) statsHtml += `<span class="stat-badge-full" style="color:#166534; background:#dcfce7;">➕ ${stats.newContent} New Content</span>`;
            if (stats.methodology > 0) statsHtml += `<span class="stat-badge-full" style="color:#5b21b6; background:#f5f3ff;">🧠 ${stats.methodology} Methodology</span>`;
            if (stats.comparison > 0) statsHtml += `<span class="stat-badge-full" style="color:#c2410c; background:#fff7ed;">⚖️ ${stats.comparison} Comparison</span>`;
            statsHtml += `</span>`;

            sectionTitle.innerHTML = `<span>${section.title}</span> ${statsHtml}`;
            sectionDiv.appendChild(sectionTitle);

            const ul = document.createElement('ul');
            ul.className = 'toc-list';


            section.items.forEach(item => {
                const li = document.createElement('li');
                li.className = 'toc-item';

                // Find actual comment data to check tags
                const commentData = data[section.index].comments[item.commentId]; // Note: This assumes 1:1 mapping, verifying via logic
                // Actually, commentId from TOC is intended to map to index in comments array.
                // TOC item 0 -> comments[0] (which might be intro), so we need to be careful.
                // The provided TOC structure assumes specific indices.
                // Let's assume the mapping provided by user earlier is consistent with indices 0, 1, 2... of valid comments.

                // Let's try to map strictly. If "commentId" is just a sequence (0, 1, 2...), we might need to skip intro if it exists depending on how data is structured.
                // However, based on previous `renderContent`, we iterate all comments. 
                // Let's assume commentId in TOC refers to the absolute index in the `comments` array for simplicty, 
                // BUT the user prompts suggest "comment 1, 2, 3...".
                // Let's grab tags from the actual data object at that index.
                let itemTags = [];
                if (data[section.index].comments[item.commentId]) {
                    itemTags = data[section.index].comments[item.commentId].tags || [];
                }

                // Generate mini badges for the list item
                let badgesHtml = '';
                if (itemTags.includes('Experiment')) { badgesHtml += '<span class="mini-badge exp" title="Experiment">🧪</span>'; li.classList.add('item-experiment'); }
                if (itemTags.includes('Revision')) { badgesHtml += '<span class="mini-badge rev" title="Revision">📄</span>'; li.classList.add('item-revision'); }
                if (itemTags.includes('New Content')) { badgesHtml += '<span class="mini-badge new" title="New Content">➕</span>'; li.classList.add('item-new-content'); }
                if (itemTags.includes('Methodology')) { badgesHtml += '<span class="mini-badge meth" title="Methodology">🧠</span>'; li.classList.add('item-methodology'); }
                if (itemTags.includes('Comparison')) { badgesHtml += '<span class="mini-badge comp" title="Comparison">⚖️</span>'; li.classList.add('item-comparison'); }

                li.innerHTML = `<span>${item.label}</span> <span class="badge-container">${badgesHtml}</span>`;

                li.addEventListener('click', () => {
                    renderContent(data[section.index], section.index);

                    // Scroll to specific comment
                    setTimeout(() => {
                        const element = document.getElementById(`comment-${section.index}-${item.commentId}`);
                        if (element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            // Highlight effect
                            element.classList.add('highlight-flash');
                            setTimeout(() => element.classList.remove('highlight-flash'), 2000);
                        }
                    }, 100);
                });

                ul.appendChild(li);
            });

            sectionDiv.appendChild(ul);
            tocContainer.appendChild(sectionDiv);
        });

        const backBtn = document.createElement('div');
        backBtn.style.textAlign = 'center';
        backBtn.style.marginTop = '2rem';
        backBtn.style.color = 'var(--text-color)';
        backBtn.style.opacity = '0.5';
        backBtn.innerHTML = 'Select a topic to view details';
        dashboard.appendChild(backBtn);

        dashboard.appendChild(tocContainer);
        contentContainer.appendChild(dashboard);
    }

    function processLatexContent(text) {
        if (!text) return '';

        // Convert LaTeX formatting to HTML-friendly format
        let processed = text;

        // Handle inline math: \( ... \) or $ ... $
        processed = processed.replace(/\\\((.*?)\\\)/g, (match, p1) => `\\(${p1}\\)`);
        processed = processed.replace(/\$([^\$]+)\$/g, (match, p1) => `\\(${p1}\\)`);

        // Handle display math: \[ ... \] or $$ ... $$
        processed = processed.replace(/\\\[(.*?)\\\]/gs, (match, p1) => `\\[${p1}\\]`);
        processed = processed.replace(/\$\$(.*?)\$\$/gs, (match, p1) => `\\[${p1}\\]`);

        // Clean up LaTeX table formatting artifacts
        processed = processed.replace(/{@\{\}[lrc]+@\{\}}/g, '');
        processed = processed.replace(/\{[lrc]+\}/g, ''); // Handle {llccccc}
        processed = processed.replace(/\\toprule|\\midrule|\\bottomrule|\\cmidrule\(lr\)\{[^}]+\}/g, '');
        processed = processed.replace(/\\multirow\{[^}]+\}\{[^}]+\}\{[^}]+\}/g, '');
        processed = processed.replace(/\\multicolumn\{[^}]+\}\{[^}]+\}\{[^}]+\}/g, '');
        processed = processed.replace(/\\hline/g, '');

        // Convert LaTeX bold to HTML
        processed = processed.replace(/\\textbf\{([^}]+)\}/g, '<strong>$1</strong>');
        processed = processed.replace(/<b>([^<]+)<\/b>/g, '<strong>$1</strong>');

        // Convert LaTeX italic to HTML
        processed = processed.replace(/\\textit\{([^}]+)\}/g, '<em>$1</em>');
        processed = processed.replace(/<i>([^<]+)<\/i>/g, '<em>$1</em>');

        // Convert LaTeX sections
        processed = processed.replace(/\\paragraph\{([^}]+)\}/g, '<h4>$1</h4>');
        processed = processed.replace(/\\section\{([^}]+)\}/g, '<h3>$1</h3>');

        // Handle center environment
        processed = processed.replace(/\\begin\{center\}/g, '<div style="text-align:center">');
        processed = processed.replace(/\\end\{center\}/g, '</div>');
        processed = processed.replace(/Unknown environment 'center'/g, '');

        // Convert LaTeX lists
        processed = processed.replace(/\\begin\{itemize\}/g, '<ul>');
        processed = processed.replace(/\\end\{itemize\}/g, '</ul>');
        processed = processed.replace(/\\begin\{enumerate\}/g, '<ol>');
        processed = processed.replace(/\\end\{enumerate\}/g, '</ol>');
        processed = processed.replace(/\\item\s*/g, '<li>');

        // Clean up remaining LaTeX commands
        processed = processed.replace(/\\hyperlink\{[^}]+\}\{([^}]+)\}/g, '$1');
        processed = processed.replace(/\\begin\{quote\}/g, '<blockquote>');
        processed = processed.replace(/\\end\{quote\}/g, '</blockquote>');
        processed = processed.replace(/\\phantomsection/g, '');
        processed = processed.replace(/\\label\{[^}]+\}/g, '');
        processed = processed.replace(/\\ref\{[^}]+\}/g, '[ref]');
        processed = processed.replace(/\\cite\{[^}]+\}/g, '[cite]');

        // Fix line breaks
        processed = processed.replace(/\n\n+/g, '</p><p>');
        processed = processed.replace(/\n/g, '<br>');

        return processed;
    }

    // State for filtering
    let activeFilter = null; // 'Experiment', 'Revision', etc.

    function toggleFilter(tag) {
        if (activeFilter === tag) {
            activeFilter = null; // Clear filter
        } else {
            activeFilter = tag;
        }

        // Re-render current view to apply filter
        // If we are in dashboard, just update visual state of legend
        const dashboard = document.querySelector('.dashboard');
        if (dashboard) {
            updateLegendVisuals();
        } else {
            // We are in reviewer view, re-render content
            // Need to know current reviewer index. We can find it from existing DOM or passed state
            const currentSection = document.querySelector('.reviewer-section');
            if (currentSection) {
                // Determine current index from title or something? 
                // Better: rely on global state or reconstruct. 
                // Actually, renderHeader passes the index. 
                // Let's just trigger a re-render if we can. 
                // Ideally, we just toggle visibility classes without full re-render.
                applyFilterToContent();
            }
        }
        updateLegendVisuals(); // Update legend everywhere if visible
    }

    // Expose to window for onclick handlers
    window.toggleFilter = toggleFilter;

    function updateLegendVisuals() {
        document.querySelectorAll('.legend-item').forEach(item => {
            const tag = item.getAttribute('data-tag');
            if (activeFilter) {
                if (activeFilter === tag) {
                    item.classList.add('filter-active');
                    item.classList.remove('filter-dimmed');
                } else {
                    item.classList.remove('filter-active');
                    item.classList.add('filter-dimmed');
                }
            } else {
                item.classList.remove('filter-active');
                item.classList.remove('filter-dimmed');
            }
        });
    }

    function applyFilterToContent() {
        const items = document.querySelectorAll('.discussion-item');
        items.forEach(item => {
            if (!activeFilter) {
                item.classList.remove('hidden-by-filter');
                return;
            }

            // Check tags of this item
            // We need to look up data again or check DOM. 
            // Looking at the DOM for tags is easiest since we render them.
            const tags = Array.from(item.querySelectorAll('.tag')).map(t => t.innerText.trim());
            // Tags text often includes icon, e.g. "🧪 Experiment"
            // Let's check if any tag text includes our filter keyword
            const matches = tags.some(t => t.includes(activeFilter));

            if (matches) {
                item.classList.remove('hidden-by-filter');
            } else {
                item.classList.add('hidden-by-filter');
            }
        });
    }

    function renderHeader(reviewerIndex, title) {
        // Remove existing header if any
        const existing = document.querySelector('.sticky-header');
        if (existing) existing.remove();

        const header = document.createElement('div');
        header.className = 'sticky-header';

        // Left: Home
        const left = document.createElement('div');
        left.className = 'nav-controls left-controls';

        const homeBtn = document.createElement('button');
        homeBtn.className = 'nav-btn';
        homeBtn.innerHTML = '🏠 Home';
        homeBtn.onclick = () => renderDashboard(responseData);
        left.appendChild(homeBtn);

        // Checklist Link (small)
        const checklistBtn = document.createElement('button');
        checklistBtn.className = 'nav-btn';
        checklistBtn.innerHTML = '✅ Checklist';
        checklistBtn.onclick = () => window.location.href = 'index2.html';
        left.appendChild(checklistBtn);

        // Center: Navigation
        const center = document.createElement('div');
        center.className = 'nav-controls center-controls';

        const prevBtn = document.createElement('button');
        prevBtn.className = 'nav-btn';
        prevBtn.innerHTML = '← Prev';
        if (reviewerIndex > 0) {
            prevBtn.onclick = () => renderContent(responseData[reviewerIndex - 1], reviewerIndex - 1);
        } else {
            prevBtn.disabled = true;
            prevBtn.classList.add('disabled');
        }
        center.appendChild(prevBtn);

        const nextBtn = document.createElement('button');
        nextBtn.className = 'nav-btn';
        nextBtn.innerHTML = 'Next →';
        if (reviewerIndex < responseData.length - 1) {
            nextBtn.onclick = () => renderContent(responseData[reviewerIndex + 1], reviewerIndex + 1);
        } else {
            nextBtn.disabled = true;
            nextBtn.classList.add('disabled');
        }
        center.appendChild(nextBtn);

        // Right: Theme Toggle
        const right = document.createElement('div');
        right.className = 'nav-controls right-controls';

        const themeBtn = document.createElement('button');
        themeBtn.className = 'nav-btn theme-toggle-header';
        themeBtn.innerHTML = document.documentElement.getAttribute('data-theme') === 'dark' ? '☀️' : '🌙';
        themeBtn.onclick = () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            themeBtn.innerHTML = newTheme === 'dark' ? '☀️' : '🌙';
        };
        right.appendChild(themeBtn);

        header.appendChild(left);
        header.appendChild(center);
        header.appendChild(right);

        return header;
    }

    function renderContent(reviewerData, index) {
        contentContainer.innerHTML = '';
        activeFilter = null; // Reset filter on nav? Or keep it? User might want persistence. Let's keep global but visually reset? No, let's reset to avoid confusion.

        // Create Sticky Header
        const header = renderHeader(index, reviewerData.reviewer);
        contentContainer.appendChild(header);

        // Response Controls
        const controls = document.createElement('div');
        controls.className = 'response-controls';
        controls.innerHTML = `<button class="nav-btn" id="collapse-all">Collapse All Responses</button>`;
        contentContainer.appendChild(controls);

        let allCollapsed = false;
        controls.querySelector('#collapse-all').addEventListener('click', () => {
            allCollapsed = !allCollapsed;
            const btn = controls.querySelector('#collapse-all');
            btn.innerText = allCollapsed ? "Expand All Responses" : "Collapse All Responses";

            document.querySelectorAll('.discussion-item').forEach(item => {
                // The structure is discussion-item -> [tags, comment-card, arrow, response-card]
                const responseCard = item.querySelector('.response-card');
                if (responseCard) {
                    if (allCollapsed) {
                        responseCard.classList.add('collapsed');
                    } else {
                        responseCard.classList.remove('collapsed');
                    }
                    if (responseCard.style.display === 'none') responseCard.style.display = ''; // Reset
                }
            });
        });

        const section = document.createElement('section');
        section.className = 'reviewer-section';
        // ... rest of render logic ...

        const title = document.createElement('h2');
        title.className = 'section-title';
        title.textContent = reviewerData.reviewer;
        section.appendChild(title);

        reviewerData.comments.forEach((item, commentIndex) => {
            const discussionItem = document.createElement('div');
            discussionItem.className = 'discussion-item';
            discussionItem.id = `comment-${index}-${commentIndex}`;

            if (item.is_intro) {
                const introBlock = document.createElement('div');
                introBlock.className = 'content-text';
                introBlock.innerHTML = processLatexContent(item.comment);
                discussionItem.appendChild(introBlock);
            } else {
                // Generate Tags HTML
                let tagsHtml = '';
                if (item.tags && item.tags.length > 0) {
                    tagsHtml = '<div class="tags-container">';
                    item.tags.forEach(tag => {
                        let icon = '';
                        let className = 'tag';
                        if (tag === 'Experiment') { icon = '🧪'; className += ' tag-experiment'; }
                        else if (tag === 'Revision') { icon = '📄'; className += ' tag-revision'; }
                        else if (tag === 'New Content') { icon = '➕'; className += ' tag-new-content'; }
                        else if (tag === 'Methodology') { icon = '🧠'; className += ' tag-methodology'; }
                        else if (tag === 'Comparison') { icon = '⚖️'; className += ' tag-comparison'; }

                        tagsHtml += `<span class="${className}">${icon} ${tag}</span>`;
                    });
                    tagsHtml += '</div>';
                }

                // Reviewer Comment Card
                // Enhanced styling for question as requested
                const commentCard = document.createElement('div');
                commentCard.className = 'reviewer-card';

                // Extract Reviewer ID and Comment ID from title to generate stable ID
                // Format: "Reviewer X, Comment X.Y" -> id="comment:X.Y"
                const idMatch = item.title.match(/Reviewer (\d+), Comment (\d+(\.\d+)?)/);
                if (idMatch) {
                    commentCard.id = `comment:${idMatch[2]}`;
                }

                commentCard.innerHTML = `
                    <h4 class="comment-title question-style">
                        <span class="q-icon">❓</span> ${item.title}
                    </h4>
                    ${tagsHtml}
                    <div class="content-text">${processLatexContent(item.comment)}</div>
                `;
                discussionItem.appendChild(commentCard);

                // Response Card
                const responseCard = document.createElement('div');
                responseCard.className = 'response-card';

                // Header with minimize button
                const responseHeader = document.createElement('div');
                responseHeader.className = 'response-header';
                responseHeader.innerHTML = `
                    <h4>📝 Response</h4>
                    <div class="expand-icon">−</div>
                `;

                // Add click toggle
                responseHeader.addEventListener('click', () => {
                    responseCard.classList.toggle('collapsed');
                });

                const responseContent = document.createElement('div');
                responseContent.className = 'response-content';

                let imagesHtml = '';
                if (item.images && item.images.length > 0) {
                    imagesHtml = '<div class="response-images" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; margin-top: 1.5rem;">';
                    item.images.forEach(img => {
                        imagesHtml += `
                            <div class="figure-container" onclick="openLightbox('${img}')">
                                <img src="${img}" alt="Figure" loading="lazy">
                            </div>
                        `;
                    });
                    imagesHtml += '</div>';
                }

                responseContent.innerHTML = `
                    <div class="content-text">${processLatexContent(item.response)}</div>
                    ${imagesHtml}
                `;

                responseCard.appendChild(responseHeader);
                responseCard.appendChild(responseContent);

                discussionItem.appendChild(responseCard);
            }

            section.appendChild(discussionItem);
        });

        contentContainer.appendChild(section);
        document.querySelector('.content-area').scrollTop = 0;

        // Trigger MathJax rendering
        if (window.MathJax) {
            MathJax.typesetPromise().catch((err) => console.log('MathJax error:', err));
        }
    }

    // Handle Cross-Reviewer Links
    document.addEventListener('click', (e) => {
        if (e.target.tagName === 'A' && e.target.getAttribute('href') && e.target.getAttribute('href').startsWith('#comment:')) {
            e.preventDefault();
            const targetId = e.target.getAttribute('href').substring(1); // e.g. "comment:4.10" or "comment:1.4"

            // Parse reviewer index from targetId (assuming "comment:R.C")
            // R matches the reviewer index roughly.
            // Reviewer 1 -> Index 1
            // Reviewer 4 -> Index 4
            const parts = targetId.split(':');
            if (parts.length > 1) {
                const commentRef = parts[1]; // "4.10"
                const reviewerRef = commentRef.split('.')[0]; // "4"
                const reviewerIndex = parseInt(reviewerRef, 10); // 4

                // If we are currently viewing this reviewer, just scroll
                // But we don't track current view state simply. Check DOM.
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    targetElement.classList.add('highlight-flash');
                    setTimeout(() => targetElement.classList.remove('highlight-flash'), 2000);
                } else {
                    // Need to switch view
                    // Check if reviewerIndex is valid in responseData
                    // Indices in responseData: 0=Editor, 1=Rev1, 2=Rev2...
                    if (responseData[reviewerIndex]) {
                        renderContent(responseData[reviewerIndex], reviewerIndex);
                        // Wait for render
                        setTimeout(() => {
                            const newTarget = document.getElementById(targetId);
                            if (newTarget) {
                                newTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                newTarget.classList.add('highlight-flash');
                                setTimeout(() => newTarget.classList.remove('highlight-flash'), 2000);
                            }
                        }, 100);
                    }
                }
            }
        }
    });

    // Lightbox Logic
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.close-lightbox');

    window.openLightbox = function (src) {
        lightbox.style.display = 'block';
        lightboxImg.src = src;
    }

    closeBtn.onclick = function (e) {
        if (e) e.stopPropagation();
        lightbox.style.display = 'none';
    }

    lightbox.onclick = function (e) {
        if (e.target !== lightboxImg) {
            lightbox.style.display = 'none';
        }
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            lightbox.style.display = 'none';
        }
    });
});


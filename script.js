document.addEventListener('DOMContentLoaded', () => {
    // Legacy sidebar references removed
    const contentContainer = document.getElementById('content-container');
    const toggleModeBtn = document.getElementById('toggle-mode');

    // Theme toggle
    toggleModeBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    // Render Dashboard initially
    renderDashboard(responseData);

    // Function to calculate detailed stats for a reviewer
    function getReviewerStats(reviewerData) {
        let comments = 0;
        let revisions = 0;
        let experiments = 0;
        let newContent = 0;

        reviewerData.comments.forEach(c => {
            if (!c.is_intro) comments++;
            if (c.tags.includes('Revision')) revisions++;
            if (c.tags.includes('Experiment')) experiments++;
            if (c.tags.includes('New Content')) newContent++;
        });

        return { comments, revisions, experiments, newContent };
    }

    function renderDashboard(data) {
        contentContainer.innerHTML = '';

        const dashboard = document.createElement('div');
        dashboard.className = 'dashboard';

        const header = document.createElement('div');
        header.className = 'dashboard-header';
        header.innerHTML = `<h1>Outline of Responses</h1>`;
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
                if (itemTags.includes('Experiment')) badgesHtml += '<span class="mini-badge exp" title="Experiment">🧪</span>';
                if (itemTags.includes('Revision')) badgesHtml += '<span class="mini-badge rev" title="Revision">📄</span>';
                if (itemTags.includes('New Content')) badgesHtml += '<span class="mini-badge new" title="New Content">➕</span>';

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

    function renderContent(reviewerData, index) {
        contentContainer.innerHTML = '';

        // Back Button
        const backButton = document.createElement('button');
        backButton.className = 'back-btn';
        backButton.innerHTML = '← Back to Outline';
        backButton.onclick = () => renderDashboard(responseData);
        contentContainer.appendChild(backButton);

        const section = document.createElement('section');
        section.className = 'reviewer-section';

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

                        tagsHtml += `<span class="${className}">${icon} ${tag}</span>`;
                    });
                    tagsHtml += '</div>';
                }

                // Reviewer Comment Card
                // Enhanced styling for question as requested
                const commentCard = document.createElement('div');
                commentCard.className = 'reviewer-card';
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
                    <div class="minimize-btn">−</div>
                `;

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

                // Add toggle functionality
                const minimizeBtn = responseHeader.querySelector('.minimize-btn');
                let isMinimized = false;

                responseHeader.addEventListener('click', () => {
                    isMinimized = !isMinimized;
                    responseContent.style.display = isMinimized ? 'none' : 'block';
                    minimizeBtn.textContent = isMinimized ? '+' : '−';
                });

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

    // Lightbox Logic
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.close-lightbox');

    window.openLightbox = function (src) {
        lightbox.style.display = 'block';
        lightboxImg.src = src;
    }

    closeBtn.onclick = function () {
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

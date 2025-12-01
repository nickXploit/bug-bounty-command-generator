document.addEventListener('DOMContentLoaded', () => {
    const domainInput = document.getElementById('domainInput');
    const generateBtn = document.getElementById('generateBtn');
    const outputArea = document.getElementById('outputArea');
    const commandsList = document.getElementById('commandsList');
    const copyAllBtn = document.getElementById('copyAllBtn');

    const tools = [
        {
            name: 'Subfinder',
            description: 'Fast passive subdomain enumeration tool.',
            template: (domain) => `subfinder -d ${domain} -o subdomains.txt`
        },
        {
            name: 'Amass',
            description: 'In-depth attack surface mapping and asset discovery.',
            template: (domain) => `amass enum -active -d ${domain} -o amass_output.txt`
        },
        {
            name: 'Httpx',
            description: 'Fast and multi-purpose HTTP toolkit.',
            template: (domain) => `cat subdomains.txt | httpx -silent -o alive.txt`
        },
        {
            name: 'Nuclei',
            description: 'Fast and customizable vulnerability scanner.',
            template: (domain) => `nuclei -l alive.txt -t nuclei-templates/ -o nuclei_results.txt`
        },
        {
            name: 'Gau (Get All Urls)',
            description: 'Fetch known URLs from AlienVault, Wayback Machine, etc.',
            template: (domain) => `gau ${domain} | tee urls.txt`
        },
        {
            name: 'Katana',
            description: 'A next-generation crawling and spidering framework.',
            template: (domain) => `katana -u https://${domain} -d 5 -o crawled.txt`
        },
        {
            name: 'Waybackurls',
            description: 'Fetch all the URLs that the Wayback Machine knows about.',
            template: (domain) => `echo ${domain} | waybackurls | tee wayback_urls.txt`
        },
        {
            name: 'FFuF',
            description: 'Fast web fuzzer written in Go.',
            template: (domain) => `ffuf -u https://${domain}/FUZZ -w /path/to/wordlist.txt -mc 200`
        },
        {
            name: 'Nmap',
            description: 'Network exploration and security auditing.',
            template: (domain) => `nmap -sC -sV -oA nmap_scan ${domain}`
        }
    ];

    // Initial render with placeholder
    renderCommands('example.com');

    generateBtn.addEventListener('click', () => {
        const domain = domainInput.value.trim() || 'example.com';
        renderCommands(domain);
    });

    domainInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            generateBtn.click();
        }
    });

    // Update commands live as user types (optional, but nice)
    domainInput.addEventListener('input', (e) => {
        const domain = e.target.value.trim() || 'example.com';
        renderCommands(domain);
    });

    function renderCommands(domain) {
        commandsList.innerHTML = '';
        outputArea.classList.remove('hidden');

        tools.forEach(tool => {
            const command = tool.template(domain);
            const card = document.createElement('div');
            card.className = 'command-card';
            card.innerHTML = `
                <div class="command-header">
                    <span class="tool-name">${tool.name}</span>
                    <button class="copy-btn" data-clipboard="${command}">Copy</button>
                </div>
                <div class="command-code">${command}</div>
            `;
            commandsList.appendChild(card);
        });

        // Re-attach event listeners for new buttons
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const text = e.target.getAttribute('data-clipboard');
                copyToClipboard(text, e.target);
            });
        });
    }

    copyAllBtn.addEventListener('click', () => {
        const domain = domainInput.value.trim();
        if (!domain) return;

        const allCommands = tools.map(tool => `
# ${tool.name}
${tool.template(domain)}
`).join('\n');

        copyToClipboard(allCommands, copyAllBtn);
    });

    async function copyToClipboard(text, btnElement) {
        try {
            await navigator.clipboard.writeText(text);
            const originalText = btnElement.innerText;
            btnElement.innerText = 'Copied!';
            setTimeout(() => {
                btnElement.innerText = originalText;
            }, 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
            alert('Failed to copy to clipboard');
        }
    }
});

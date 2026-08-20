import os

if os.path.exists('dist/index.html'):
    with open('dist/index.html', 'r') as f:
        content = f.read()

    tt_script = """<script>if(window.trustedTypes&&trustedTypes.createPolicy){try{trustedTypes.createPolicy('default',{createHTML:(s)=>s,createScript:(s)=>s,createScriptURL:(s)=>s})}catch(e){}}</script>"""

    content = content.replace('<head>', '<head>' + tt_script)

    with open('dist/index.html', 'w') as f:
        f.write(content)

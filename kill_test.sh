kill $(ps aux | grep "node test_browser_prod.cjs" | grep -v grep | awk '{print $2}')

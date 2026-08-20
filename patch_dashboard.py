import os

with open('pages/Dashboard.tsx', 'r') as f:
    content = f.read()

# Add SkeletonDashboard component
skeleton_code = """
const SkeletonDashboard = () => (
    <div className="space-y-8 animate-pulse print:hidden">
        <div className="flex justify-between items-center">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 md:w-1/4"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
        </div>
        
        {/* Profile Completion Skeleton */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-l-4 border-gray-300 dark:border-gray-600">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-6"></div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>)}
            </div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32 mt-4"></div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
                <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center">
                    <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 mr-4"></div>
                    <div className="flex-1">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>
                </div>
            ))}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 mr-4"></div>
                    <div className="flex-1">
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>
                </div>
            ))}
        </div>

        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[1, 2].map(i => (
                <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md h-[400px] flex flex-col">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-6"></div>
                    <div className="flex-1 flex justify-center items-center">
                        {i === 1 ? (
                            <div className="h-48 w-48 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                        ) : (
                            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const Dashboard: React.FC = () => {"""

content = content.replace("const Dashboard: React.FC = () => {", skeleton_code)

# Add isLoading
target_hook = """    const { profiles, organizations } = useWidyaiswara();"""
replacement_hook = """    const { profiles, organizations, isLoading } = useWidyaiswara();"""
content = content.replace(target_hook, replacement_hook)

# Add early return for isLoading
target_return = """    return (
        <motion.div"""
replacement_return = """    if (isLoading) {
        return <SkeletonDashboard />;
    }

    return (
        <motion.div"""
content = content.replace(target_return, replacement_return)

with open('pages/Dashboard.tsx', 'w') as f:
    f.write(content)

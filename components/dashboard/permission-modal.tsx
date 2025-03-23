import { Button } from "../ui/button";

export const PermissionModal = ({ showPermissionModal, setShowPermissionModal, setMicrophonePermission, requestMicrophonePermission }: { showPermissionModal: boolean, setShowPermissionModal: any, setMicrophonePermission: any, requestMicrophonePermission: any }) => (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${showPermissionModal ? '' : 'hidden'}`}>
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Microphone Access Required</h3>
            <p className="mb-6">
                To use voice features, this app needs access to your microphone.
                Please click &quot;Allow&quot; when your browser asks for permission.
            </p>
            <div className="flex justify-end space-x-3">
                <Button
                    variant="outline"
                    onClick={() => {
                        setShowPermissionModal(false);
                        setMicrophonePermission('denied');
                    }}
                >
                    Cancel
                </Button>
                <Button
                    variant={"primary"}
                    onClick={requestMicrophonePermission}
                >
                    Continue
                </Button>
            </div>
        </div>
    </div>
);
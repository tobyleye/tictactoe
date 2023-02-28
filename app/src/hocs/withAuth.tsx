import { Modal } from "@/components/Modal";
import { useContext, FC } from "react";
import { AuthContext } from "@/components/AuthProvider";
import { Signin } from "@/components/Signin";

export function withAuth<Props>(Component: FC<Props>) {
  return function Wrapper(props: Props & JSX.IntrinsicAttributes) {
    const { user } = useContext(AuthContext);
    if (!user) {
      return (
        <Modal open={true}>
          <div>
            {/* <h3 className="text-3xl font-bold mb-8">Login to continue</h3> */}
            <Signin />
          </div>
        </Modal>
      );
    }

    return <Component {...props} />;
  };
}

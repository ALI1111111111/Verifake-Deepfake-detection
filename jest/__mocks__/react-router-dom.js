// Mock for React Router
export const BrowserRouter = ({ children }) => children;
export const Routes = ({ children }) => children;
export const Route = ({ element }) => element;
export const Navigate = () => null;
export const Link = ({ children, to, ...props }) => 
  React.createElement('a', { href: to, ...props }, children);

export const useNavigate = () => jest.fn();
export const useLocation = () => ({
  pathname: '/',
  search: '',
  hash: '',
  state: null,
});
export const useParams = () => ({});
export const useSearchParams = () => [new URLSearchParams(), jest.fn()];

export default {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
  useNavigate,
  useLocation,
  useParams,
  useSearchParams,
};

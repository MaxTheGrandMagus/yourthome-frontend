import { userConstants } from '../_constants';
import { userService } from '../_services';
import { alertActions } from './';
// import { history } from '../_helpers';

export const userActions = {
    login,
    logout,
    register,
    getAll,
    update: _update,
    delete: _delete,
    getUserRentals: getUserRentals,
    postNewRental
};

function login(username, password) {
    return dispatch => {
        dispatch(request({ username }));

        userService.login(username, password)
            .then(
                user => { 
                    dispatch(success(user));
                    // history.push('/user');
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error(error));
                }
            );
    };

    function request(user) { return { type: userConstants.LOGIN_REQUEST, user } }
    function success(user) { return { type: userConstants.LOGIN_SUCCESS, user } }
    function failure(error) { return { type: userConstants.LOGIN_FAILURE, error } }
}

function logout() {
    userService.logout();
    return { type: userConstants.LOGOUT };
}

function register(user) {
    return dispatch => {
        dispatch(request(user));

        userService.register(user)
            .then(
                user => { 
                    dispatch(success());
                    // history.push('/login');
                    dispatch(alertActions.success('Registration successful'));
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error(error));
                }
            );
    };

    function request(user) { return { type: userConstants.REGISTER_REQUEST, user } }
    function success(user) { return { type: userConstants.REGISTER_SUCCESS, user } }
    function failure(error) { return { type: userConstants.REGISTER_FAILURE, error } }
}

function getAll() {
    return dispatch => {
        dispatch(request());

        userService.getAll()
            .then(
                users => dispatch(success(users)),
                error => dispatch(failure(error))
            );
    };

    function request() { return { type: userConstants.GETALL_REQUEST } }
    function success(users) { return { type: userConstants.GETALL_SUCCESS, users } }
    function failure(error) { return { type: userConstants.GETALL_FAILURE, error } }
}

function _update(id) {
    return dispatch => {
        dispatch(request(id));

        userService.update(id)
            .then(
                user => { 
                    dispatch(success(id));
                },
                error => {
                    dispatch(failure(id, error));
                }
            );
    };

    function request(id) { return { type: userConstants.USER_UPDATE_REQUEST, id } }
    function success(id) { return { type: userConstants.USER_UPDATE_SUCCESS, id } }
    function failure(id, error) { return { type: userConstants.USER_UPDATE_FAILURE, id, error } }
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    return dispatch => {
        dispatch(request(id));

        userService.delete(id)
            .then(
                user => { 
                    dispatch(success(id));
                },
                error => {
                    dispatch(failure(id, error));
                }
            );
    };

    function request(id) { return { type: userConstants.DELETE_REQUEST, id } }
    function success(id) { return { type: userConstants.DELETE_SUCCESS, id } }
    function failure(id, error) { return { type: userConstants.DELETE_FAILURE, id, error } }
}

// PersonalPage
function getUserRentals() {
    return dispatch => {
        dispatch(request());

        userService.getUserRentalsService()
            .then(
                userRentals => dispatch(success(userRentals)),
                error => dispatch(failure(error))
            );
    };

    function request() { return { type: userConstants.GETALL_USERRENTALS_REQUEST } }
    function success(userRentals) { return { type: userConstants.GETALL_USERRENTALS_SUCCESS, userRentals } }
    function failure(error) { return { type: userConstants.GETALL_USERRENTALS_FAILURE, error } }
}

function postNewRental(rental){
    return dispatch => {
        dispatch(request(rental));

        userService.postNewRentalService(rental)
            .then(
                rental => { 
                    dispatch(success());
                    // history.push('/');
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error(error));
                }
            );
    };

    function request(rental) { return { type: userConstants.POST_NEW_RENTAL_REQUEST, rental } }
    function success(rental) { return { type: userConstants.POST_NEW_RENTAL_SUCCESS, rental } }
    function failure(error) { return { type: userConstants.POST_NEW_RENTAL_FAILURE, error } }
}
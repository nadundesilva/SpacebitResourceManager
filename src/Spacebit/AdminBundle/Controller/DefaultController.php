<?php

namespace Spacebit\AdminBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use \Symfony\Component\HttpFoundation\Response;
use \Symfony\Component\HttpFoundation\Request;

class DefaultController extends Controller
{
    public function homeAction()
    {
        $conn = $this->get('database_connection');
        $user_id = $this->get('session')->get('user_id');

        $stmt = $conn->prepare('SELECT COUNT(request_id) AS count FROM ((resource_request INNER JOIN resource USING(resource_id)) INNER JOIN resource_administration USING(resource_id)) INNER JOIN equipment USING(resource_id) WHERE status = 2 AND resource_administration.user_id = :user_id;');
        $stmt->bindValue(':user_id', $user_id);
        $stmt->execute();
        $equipment_request_count = $stmt->fetch();

        $stmt = $conn->prepare('SELECT COUNT(request_id) AS count FROM ((resource_request INNER JOIN resource USING(resource_id)) INNER JOIN resource_administration USING(resource_id)) INNER JOIN venue USING(resource_id) WHERE status = 2 AND resource_administration.user_id = :user_id;');
        $stmt->bindValue(':user_id', $user_id);
        $stmt->execute();
        $venues_request_count = $stmt->fetch();

        $stmt = $conn->prepare('SELECT COUNT(request_id) AS count FROM vehicle_request WHERE status = 2;');
        $stmt->execute();
        $vehicle_request_count = $stmt->fetch();

        return $this->render('SpacebitAdminBundle:Default:home.html.twig', array(
            'equipment_request_count'=>$equipment_request_count['count'],
            'venues_request_count'=>$venues_request_count['count'],
            'vehicles_request_count'=>$vehicle_request_count['count'],
        ));
    }
}
